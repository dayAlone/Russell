import request from 'co-request'
import cheerio from 'cheerio'
import randomstring from 'randomstring'
import config from 'config'
let headers = {
    'Content-Type': 'multipart/form-data; boundary=5XrykHW7vJdMJVfUXBrPtudt5QyUO3g3',
    'User-Agent': 'Paw/2.2.5 (Macintosh; OS X/10.11.0) GCDHTTPRequest'
}


export const getAuth = function*() {
    let jar = request.jar()
    try {
        yield request.post({
            url: 'https://kpkcheck.ru/User/Login.aspx',
            headers: headers,
            formData: {
                loginEmail: config.kpk.login,
                loginPassword: config.kpk.password
            },
            jar: jar
        })
    } catch (e) {
        console.error(e.stack)
    }
    return jar
}

let getStatus = (status) => {
    switch (status) {
    case 'incorrect':
        return { status: 'canceled', message: 'Чек не прошел автоматическую проверку' }
    case 'processing':
        return { status: 'processing', message: 'Чек ожидает проверки' }
    case 'correct':
        return { status: 'correct', message: 'Чек прошел автоматическую проверку, ожидается подтверждение модератором' }
    }
}

export const getCheckStatus = function*(jar, id) {
    let status = yield request.get({
        url: 'https://kpkcheck.ru/System/ViewDocument.aspx?type=0&key=' + id,
        headers: headers,
        jar: jar
    })
    let $ = cheerio.load(status.body, {decodeEntities: false})
    return getStatus($('#v' + id).attr('class').split(' ')[1])
}
export const addCheck = function* (jar, income) {
    let tmp = randomstring.generate()

    let { inn, eklz, date, time, total, kpk_number, kpk_value} = income
    let data =
        {
            __VIEWSTATE: 'AEqv7l6JOQ5BErg6rWpfcuTPGqsU78GhszU64Qq4+c4IlbH8elvETT3W3dZzrihsPCRpKj1gwo5p3Y+Rzn53XHR+67Bq8QQ9ubP9Go27M+dHFloX',
            __EVENTVALIDATION: '0aMVBUIcVJt3vSNC3yughy+CoaD5np0EfNUQX7hHO8eRYyOJeSwtWU9AamkPLVVOv8ks77JPkmwGkwhPwgbJuaYKfwpp+lfdLGJPp8gH6HpyQqhUiL1PyQbZRtN1fctyksYTVU0mYTJz2Fw7/q4jffH7y7EP8oTrpHaqbc6u7O8UTEJ5M507FqrqLBLNrvF69aRSbQvJT9vJaaaYCJ7TeLgjqdxv2v/GvKw4177MwkAKyVnRGJOMuPiJrRWW7kL1vT1VTg==',

            // Тип операции
            pagePart$ctl02$docType: 'Продажа',
            // Наименование
            pagePart$ctl02$docOrgName: tmp,
            // ИНН
            pagePart$ctl02$docTaxPayerNumber: inn,
            // Регистрационный номер ЭКЛЗ
            pagePart$ctl02$docEclpNumber: eklz,
            // Дата
            pagePart$ctl02$docDateDay: date.split('.')[0],
            pagePart$ctl02$docDateMonth: date.split('.')[1],
            pagePart$ctl02$docDateYear: date.split('.')[2],

            pagePart$ctl02$docDateHour: time.split(':')[0],
            pagePart$ctl02$docDateMinute: time.split(':')[1],
            // Сумма
            pagePart$ctl02$docSumRub: total.split('.')[0] ? total.split('.')[0] : total,
            pagePart$ctl02$docSumCop: total.split('.')[1] ? total.split('.')[1] : '',

            // Номер КПК
            pagePart$ctl02$docCvcNumber: kpk_number,

            // Значение КПК
            pagePart$ctl02$docCvcValue: kpk_value,

            pagePart$documentSubmit: 'Проверить'
        }


    let status = yield request.post({
        url: 'https://kpkcheck.ru/System/Control.aspx?name=VerifyDocument&type=0',
        headers: headers,
        formData: data,
        followAllRedirects: true,
        jar: jar
    })
    let $ = cheerio.load(status.body, {decodeEntities: false})
    let result = false
    $('#dataForm tbody tr').map((i, el) => {
        let row = {
            id: $(el).find('td:nth-child(6) span').attr('id'),
            added: $(el).find('td:nth-child(2)').html(),
            organisation: $(el).find('td:nth-child(4)').text(),
            eklz: $(el).find('td:nth-child(5)').text(),
            result: getStatus($(el).find('td:nth-child(6) span').attr('class').split(' ')[1])
        }
        if (row.organisation === tmp && row.eklz === eklz) result = row
    })

    return result ? result : { error: true, message: $('#documentError div').html().replace(/\s\s/g, '') }

}

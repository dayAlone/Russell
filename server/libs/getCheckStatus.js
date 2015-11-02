import request from 'co-request'
import cheerio from 'cheerio'
import randomstring from 'randomstring'
import config from 'config'
export default function* (income) {
    let jar = request.jar()
    let tmp = randomstring.generate()
    let headers = {
        'Content-Type': 'multipart/form-data; boundary=5XrykHW7vJdMJVfUXBrPtudt5QyUO3g3',
        'User-Agent': 'Paw/2.2.5 (Macintosh; OS X/10.11.0) GCDHTTPRequest'
    }
    let { inn, eklz, date__day, date__month, date__year, time__hours, time__minutes, total__rubles, total__cents, kpk_number, kpk_value} = income
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
            pagePart$ctl02$docDateDay: date__day,
            pagePart$ctl02$docDateMonth: date__month,
            pagePart$ctl02$docDateYear: date__year,
            pagePart$ctl02$docDateHour: time__hours,
            pagePart$ctl02$docDateMinute: time__minutes,
            // Сумма
            pagePart$ctl02$docSumRub: total__rubles,
            pagePart$ctl02$docSumCop: total__cents,

            // Номер КПК
            pagePart$ctl02$docCvcNumber: kpk_number,

            // Значение КПК
            pagePart$ctl02$docCvcValue: kpk_value,

            pagePart$documentSubmit: 'Проверить'
        }

    yield request.post({
        url: 'https://kpkcheck.ru/User/Login.aspx',
        headers: headers,
        formData: {
            loginEmail: config.kpk.login,
            loginPassword: config.kpk.password
        },
        jar: jar
    })
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
            result: {
                code: $(el).find('td:nth-child(6) span').attr('class').split(' ')[1],
                text: $(el).find('td:nth-child(6) span').text().replace(/\s+/g, '')
            }
        }
        if (row.organisation === tmp && row.eklz === eklz) result = row
    })
    return result


}
/*
request
	.cookie('.rvWebClient=2083361965A5B4C756EBEB0F7C94E1807A55DA908EE993552AEB59ED1710682E6348C22D2B68D0C97DE92F974C5C2D1BEBF5E02D92B53A9CE5243D8CC9A6797B91DACC4400C54D3B459BBA34E799B213952A025575EC3403EAEA6E3E4000E8120900893915438D3300F8F0689F12B26B7B56AC819A7133F2338C7E55FF7E3489D1B0B814')
	.post(
        {url: 'https://kpkcheck.ru/System/Control.aspx?name=VerifyDocument&amp;type=0', form: data},
        function(err, httpResponse, body) {
            console.log(err, body)
    	})
*/

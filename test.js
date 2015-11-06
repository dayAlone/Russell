//https://kpkcheck.ru/System/Control.aspx?name=VerifyDocument&amp;type=0
var request = require('request')
var cheerio = require('cheerio')

var jar = request.jar()
var data =
    {
        __VIEWSTATE: 'AEqv7l6JOQ5BErg6rWpfcuTPGqsU78GhszU64Qq4+c4IlbH8elvETT3W3dZzrihsPCRpKj1gwo5p3Y+Rzn53XHR+67Bq8QQ9ubP9Go27M+dHFloX',
        __EVENTVALIDATION: '0aMVBUIcVJt3vSNC3yughy+CoaD5np0EfNUQX7hHO8eRYyOJeSwtWU9AamkPLVVOv8ks77JPkmwGkwhPwgbJuaYKfwpp+lfdLGJPp8gH6HpyQqhUiL1PyQbZRtN1fctyksYTVU0mYTJz2Fw7/q4jffH7y7EP8oTrpHaqbc6u7O8UTEJ5M507FqrqLBLNrvF69aRSbQvJT9vJaaaYCJ7TeLgjqdxv2v/GvKw4177MwkAKyVnRGJOMuPiJrRWW7kL1vT1VTg==',

        // Тип операции
        pagePart$ctl02$docType: 'Продажа',
        // Наименование
        pagePart$ctl02$docOrgName: 'ООО "М.видео Менеджмент"',
        // ИНН
        pagePart$ctl02$docTaxPayerNumber: '7707548740',
        // Регистрационный номер ЭКЛЗ
        pagePart$ctl02$docEclpNumber: '1452788789',
        // Дата
        pagePart$ctl02$docDateDay: '26',
        pagePart$ctl02$docDateMonth: '10',
        pagePart$ctl02$docDateYear: '15',
        pagePart$ctl02$docDateHour: '11',
        pagePart$ctl02$docDateMinute: '34',
        // Сумма
        pagePart$ctl02$docSumRub: '399',
        pagePart$ctl02$docSumCop: '00',

        // Номер КПК
        pagePart$ctl02$docCvcNumber: '33808',

        // Значение КПК
        pagePart$ctl02$docCvcValue: '40756',

        pagePart$documentSubmit: 'Проверить'
    }

request.post(
    {
        url: 'https://kpkcheck.ru/User/Login.aspx',
        followAllRedirects: true,
        headers: {
            'Content-Type': 'multipart/form-data; boundary=5XrykHW7vJdMJVfUXBrPtudt5QyUO3g3',
            'User-Agent': 'Paw/2.2.5 (Macintosh; OS X/10.11.0) GCDHTTPRequest'
        },
        formData: {
            loginEmail: 'kruchkov@frogs-studio.ru',
            loginPassword: 'manufaktura'
        },
        jar: jar
    },
    function(err, httpResponse, body) {
        request.get({
            url: 'https://kpkcheck.ru/System/Documents.aspx',
            headers: {
                'Content-Type': 'multipart/form-data; boundary=5XrykHW7vJdMJVfUXBrPtudt5QyUO3g3',
                'User-Agent': 'Paw/2.2.5 (Macintosh; OS X/10.11.0) GCDHTTPRequest'
            },
            jar: jar
        }, function(err, httpResponse, body) {
                var $ = cheerio.load(body, {decodeEntities: false})
                var result = []
                $('#dataForm tbody tr').map(function (i, el) {
                    result.push({
                        id: $(el).find('td:nth-child(6) span').attr('id'),
                        added: $(el).find('td:nth-child(2)').html(),
                        organisation: $(el).find('td:nth-child(4)').text(),
                        eklz: $(el).find('td:nth-child(5)').text(),
                        result: {
                            code: $(el).find('td:nth-child(6) span').attr('class').split(' ')[1],
                            text: $(el).find('td:nth-child(6) span').text().replace(/\s+/g, '')
                        }
                    })
                })
                console.log(body)
        })
        /*
        request.post({
            url: 'https://kpkcheck.ru/System/Control.aspx?name=VerifyDocument&type=0',
            followAllRedirects: true,
            headers: {
                'Content-Type': 'multipart/form-data; boundary=5XrykHW7vJdMJVfUXBrPtudt5QyUO3g3',
                'User-Agent': 'Paw/2.2.5 (Macintosh; OS X/10.11.0) GCDHTTPRequest'
            },
            formData: data,
            jar: jar
        },
        function(err, httpResponse, body) {
            process.stdout.write(body)
        })*/
    }
)
/*
request
	.cookie('.rvWebClient=2083361965A5B4C756EBEB0F7C94E1807A55DA908EE993552AEB59ED1710682E6348C22D2B68D0C97DE92F974C5C2D1BEBF5E02D92B53A9CE5243D8CC9A6797B91DACC4400C54D3B459BBA34E799B213952A025575EC3403EAEA6E3E4000E8120900893915438D3300F8F0689F12B26B7B56AC819A7133F2338C7E55FF7E3489D1B0B814')
	.post(
        {url: 'https://kpkcheck.ru/System/Control.aspx?name=VerifyDocument&amp;type=0', form: data},
        function(err, httpResponse, body) {
            console.log(err, body)
    	})
*/

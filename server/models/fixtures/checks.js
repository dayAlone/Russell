import oid from '../../libs/oid'
import { Types } from 'mongoose'

export default (Check) => {
    let checks = [{
        organisation: 'ООО “М.Видео менеджмент”',
        inn: '007707548740',
        eklz: '1452788789',
        date: '15.05.2015',
        time: '22:16',
        total: '3565.56',
        kpk_number: '12356789',
        kpk_value: '1234789',
        photo: '/layout/images/check.jpg',
        status: '',
        status_comment: '',
        count: 1,
        vinner: true,
        products: [Types.ObjectId('9a138ed91dd4e66125f4fd90')],
        user: oid('user'),
        until: new Date('2014-01-22T14:56:59.301Z')
    }, {
        organisation: 'ООО “М.Видео менеджмент”',
        inn: '007707548740',
        eklz: '1452788789',
        date: '15.05.2015',
        time: '12:16',
        total: '3565.56',
        kpk_number: '1256789',
        kpk_value: '123456789',
        photo: '/layout/images/check.jpg',
        status: 'canceled',
        status_comment: 'Чек не прошел автоматическую проверку',
        count: 0,
        vinner: false,
        products: [],
        user: oid('user')
    }, {
        active: false,
        organisation: 'ООО “М.Видео менеджмент”',
        inn: '007707548740',
        eklz: '1452788789',
        date: '15.05.2015',
        time: '21:16',
        total: '3565.56',
        kpk_number: '123456789',
        kpk_value: '123456789',
        photo: '/layout/images/check.jpg',
        status: 'active',
        status_comment: '',
        count: 1,
        vinner: false,
        products: [Types.ObjectId('bb2e16fdbad55b0ff00e4d96')],
        user: oid('user')
    }, {
        active: false,
        organisation: 'ООО “М.Видео менеджмент”',
        inn: '007707548740',
        eklz: '1452788789',
        date: '15.05.2015',
        time: '21:16',
        total: '3565.56',
        kpk_number: '12123456789',
        kpk_value: '123456789',
        photo: '/layout/images/check.jpg',
        status: 'active',
        status_comment: '',
        count: 2,
        vinner: false,
        products: [],
        user: oid('user')
    }]
    checks.forEach(el => {
        Check.create(el, err => (console.log(err)))
    })
}

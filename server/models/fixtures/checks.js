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
        photo: '',
        status: 'autocheck',
        status_comment: '',
        count: 1,
        vinner: false,
        products: [],
        user: oid('user')
    }, {
        organisation: 'ООО “М.Видео менеджмент”',
        inn: '007707548740',
        eklz: '1452788789',
        date: '15.05.2015',
        time: '12:16',
        total: '3565.56',
        kpk_number: '1256789',
        kpk_value: '123456789',
        photo: '',
        status: 'canceled',
        status_comment: 'Чек не прошел автоматическую проверку',
        count: 2,
        vinner: false,
        products: [Types.ObjectId('562635138e2baa2b921be277')],
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
        photo: '',
        status: 'autocheck',
        status_comment: '',
        count: 1,
        vinner: true,
        products: [Types.ObjectId('5626350e8e2baa2b921be270')],
        user: oid('user')
    }]
    checks.forEach(el => {
        Check.create(el, err => (console.log(err.message, err.code)))
    })
}

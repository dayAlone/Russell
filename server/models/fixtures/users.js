import oid from '../../libs/oid'

export default (User) => {
    let users = [{
        _id: oid('admin'),
        displayName: 'Модератор Сайта',
        email: 'support@russellhobbs-promo.ru',
        password: 'co6-dwS-8J7-oEd',
        role: 'admin'
    }]
    users.forEach(el => {
        User.findOne({ email: el.email }, (err, data) => {
            if (!data) User.create(el)
        })
    })
}

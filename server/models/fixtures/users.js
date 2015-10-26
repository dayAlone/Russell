import oid from '../../libs/oid'

export default (User) => {
    let users = [{
        _id: oid('user'),
        displayName: 'Тестовый пользователь',
        email: 'test@test.ru',
        password: 'test@test.ru'
    }]
    users.forEach(el => {
        User.create(el, err => (console.log(err)))
    })
}

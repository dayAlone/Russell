import moment from 'moment'
import oid from '../../libs/oid'

export default (Game) => {
    let games = [
        {
            name: 'Выиграй мечту',
            description: 'С #start# по #end# приобретайте технику <strong>Russell Hobbs</strong>, сохраняйте чеки от покупок и участвуйте в акции &laquo;Выиграй мечту!&raquo;. Вы сможете выиграть именно то, что <nobr>вы &nbsp;&nbsp;<img class="title__heart" src="/layout/images/svg/heart.svg" width="17" /></nobr>',
            start: '12.10.2015',
            stop: '30.12.2015',
            image: '/layout/images/products.png',
            code: 'checks',
            flag: 'А также призы от RH каждую неделю!',
            raffles: ['14.12.2015 18:00', '21.12.2015 18:00', '28.12.2015 18:00'],
            sort: 100
        },
        {
            name: 'Cобери коллекцию',
            description: 'Вам нравится коллекционировать? А играть? С #start# принимайте участие в игре «Собери коллекцию» и выигрывайте технику Russell Hobbs!',
            start: '9.11.2015',
            stop: '30.12.2015',
            image: '/layout/images/banner-2.jpg',
            code: 'kitchen',
            flag: 'Конкурс!',
            raffles: ['22.11.2015 12:00', '6.12.2015 18:00', '20.12.2015 18:00', '30.12.2015 18:00'],
            sort: 200
        },
        {
            name: 'История в деталях',
            description: 'Вы любите интересные тесты? С #start# вас будут ждать увлекательные тесты на знание истории и техники Russell Hobbs и, конечно, интересные призы. Заходите и выигрывайте!',
            start: '9.11.2015',
            stop: '30.12.2015',
            image: '/layout/images/banner-3.jpg',
            code: 'test',
            flag: 'Конкурс!',
            raffles: ['22.11.2015 12:00', '6.12.2015 18:00', '20.12.2015 18:00', '30.12.2015 18:00'],
            sort: 300
        },
        {
            name: 'В подарок. Для себя',
            description: 'Что вы любите больше – дарить или получать подарки? Russell Hobbs поможет вам в обоих случаях. С #start# заходите к нам, участвуйте в акции «В подарок. Для себя» и делитесь с друзьями желаниями. Ждем вас, осталось совсем недолго!',
            start: '25.11.2015',
            stop: '30.12.2015',
            image: '/layout/images/banner-4.jpg',
            code: 'present',
            flag: 'Акция!',
            raffles: ['30.12.2015 18:00'],
            sort: 400
        },
        {
            name: 'Поделись историей',
            code: 'share-history',
            start: '28.10.2015',
            raffles: ['30.10.2015 18:00', '06.11.2015 18:00', '13.11.2015 18:00', '20.11.2015 18:00'],
            sort: 500
        },
        {
            name: 'Передай эстафету',
            code: 'maraphon',
            raffles: ['11.12.2015 18:00'],
            sort: 700
        },
        {
            name: 'В сердце компании',
            code: 'heart',
            raffles: ['11.12.2015 18:00'],
            sort: 800
        },
        {
            name: 'В сердце компании',
            code: 'heart',
            raffles: ['14.12.2015 18:00', '21.12.2015 18:00', '28.12.2015 18:00'],
            sort: 900
        }
    ]
    games.forEach(el => {
        el.start = moment(el.start, 'DD.MM.YYYY').toDate()
        el.end = moment(el.stop, 'DD.MM.YYYY').toDate()
        el.raffles = el.raffles.map(r => {
            return moment(r, 'DD.MM.YYYY HH:mm').toDate()
        })
        el._id = oid(el.name)

        Game.create(el, err => (console.log(err)))
    })
}

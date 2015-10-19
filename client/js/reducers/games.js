const initialState = {
    list: [
        {
            title: 'Вы мечтаете о стильной технике для кухни?',
            description: 'С #start# по #end# приобретайте технику <strong>Russell Hobbs</strong>, сохраняйте чеки от покупок и участвуйте в акции &laquo;Выиграй мечту!&raquo;. Вы сможете выиграть именно то, что вы &nbsp;&nbsp;<img class="title__heart" src="/layout/images/svg/heart.svg" width="17" />',
            dateStart: '12.10.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/products.png',
            link: '/games/',
            flag: 'А также призы от RH каждую неделю!'
        },
        {
            title: 'Cобери коллекцию',
            description: 'Вам нравится коллекционировать? А играть? С #start# принимайте участие в игре «Собери коллекцию» и выигрывайте технику Russell Hobbs!',
            dateStart: '9.11.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/banner-2.jpg',
            link: '/games/',
            flag: 'Конкурс!'
        },
        {
            title: 'История в деталях',
            description: 'Вы любите интересные тесты? С #start# вас будут ждать увлекательные тесты на знание истории и техники Russell Hobbs и, конечно, интересные призы. Заходите и выигрывайте!',
            dateStart: '9.11.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/banner-3.jpg',
            link: '/games/',
            flag: 'Конкурс!'
        },
        {
            title: 'В подарок. Для себя',
            description: 'Что вы любите больше – дарить или получать подарки? Russell Hobbs поможет вам в обоих случаях. С #start# заходите к нам, участвуйте в акции «В подарок. Для себя» и делитесь с друзьями желаниями. Ждем вас, осталось совсем недолго!',
            dateStart: '16.11.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/banner-4.jpg',
            link: '/games/',
            flag: 'Акция!'
        }
    ]
};

export default function(state = initialState, action) {
    switch (action.type) {
    default:
        return state;
    }
}

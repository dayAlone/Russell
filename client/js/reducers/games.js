const initialState = {
    list: [
        {
            title: 'Вы мечтаете о стильной технике для кухни?',
            description: 'С #start# по #end# приобретайте технику <strong>Russell Hobbs</strong>, сохраняйте чеки от покупок и участвуйте в акции «Выиграй мечту!». Вы сможете выиграть именно то, что вы &nbsp;&nbsp;<img class="title__heart" src="/layout/images/svg/heart.svg" width="17" />',
            dateStart: '12.10.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/products.png',
            link: '/games/'
        },
        {
            title: 'Cобери коллекцию',
            description: 'Вам нравится коллекционировать? А играть? Скоро вы сможете принять участие в нашей игре "Собери коллекцию" и выиграть технику Russell Hobbs или скидку на покупку техники Russell Hobbs. Ждем вас здесь с #start#.',
            dateStart: '9.11.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/game-2.jpg',
            link: '/games/'
        },
        {
            title: 'История в деталях',
            description: 'Вы любите интересные тесты? С #start# вас будут ждать увлекательные тесты на знание истории и техники Russell Hobbs и, конечно, интересные призы. Заходите и выигрывайте!',
            dateStart: '9.11.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/game-3.jpg',
            link: '/games/'
        },
        {
            title: 'В подарок. Для себя',
            description: 'Что вам больше нравится - дарить или получать подарки на Новый год? Теперь вы легко сможете совместить эти два приятных занятия. С #start# заходите к нам, участвуйте в акции "В подарок. Для себя" и делитесь с друзьями желаниями. Ждем вас, осталось совсем недолго!',
            dateStart: '16.11.2015',
            dateStop: '30.12.2015',
            image: '/layout/images/game-4.jpg',
            link: '/games/'
        }
    ]
};

export default function (state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

const initialState = {
    list: [
        {
            title: '5 Элемент',
            image: '/layout/images/store-14.jpg',
            link: 'http://5element.su/search/index.php?q=RUSSELL+HOBBS&s=%A0',
            color: '#063c8b'
        },
        {
            title: 'METRO Cash&Carry',
            image: '/layout/images/store-8.jpg',
            link: 'http://www.metro-cc.ru/',
            color: '#002757'
        },
        {
            title: 'Selgros Cash&Carry',
            image: '/layout/images/store-6.jpg',
            link: 'https://www.selgros.ru/centers/',
            color: '#ffffff'
        },
        {
            title: 'Глобус',
            image: '/layout/images/store-2.jpg',
            link: 'http://www.globus.ru/stores/',
            color: '#ff7521'
        },
        {
            title: 'Домотехника',
            image: '/layout/images/store-4.jpg',
            link: 'http://vladivostok.domotekhnika.ru/',
            color: '#fefefe'
        },
        {
            title: 'Карусель',
            image: '/layout/images/store-9.jpg',
            link: 'http://karusel.ru/',
            color: '#00a739'
        },
        {
            title: 'М.видео',
            image: '/layout/images/store-7.jpg',
            link: 'http://www.mvideo.ru/pricelist.php?reff=search_result&SearchWord=Russell+Hobbs&ok.x=0&ok.y=0',
            color: '#ffffff'
        },
        {
            title: 'МедиаМаркт',
            image: '/layout/images/store-5.jpg',
            link: 'https://www.mediamarkt.ru/search?q=russell+hobbs',
            color: '#ff167f'
        },
        {
            title: 'МаксидоМ',
            image: '/layout/images/store-1.jpg',
            link: 'http://www.maxidom.ru/search/catalog.php?q=RUSSELL+HOBBS&category_search=',
            color: '#f01b2d'
        },
        {
            title: 'Озон',
            image: '/layout/images/store-3.jpg',
            link: 'http://www.ozon.ru/?context=search&text=russell+hobbs',
            color: '#ffffff'
        },
        {
            title: 'Техносила',
            image: '/layout/images/store-13.jpg',
            link: 'http://www.tehnosila.ru/',
            color: '#ffffff'
        },
        {
            title: 'Эльдорадо',
            image: '/layout/images/store-12.jpg',
            link: 'http://www.eldorado.ru/search/catalog.php?q=RUSSELL+HOBBS',
            color: '#fe0e29'
        },
        {
            title: 'Энтер',
            image: '/layout/images/store-11.jpg',
            link: 'http://www.maxidom.ru/search/catalog.php?q=RUSSELL+HOBBS&category_search=',
            color: '#000000'
        },
        {
            title: 'Юлмарт',
            image: '/layout/images/store-10.jpg',
            link: 'http://www.ulmart.ru/search?string=russell+hobbs&rootCategory=&sort=6',
            color: '#ffffff'
        }
    ]
};

export default function(state = initialState, action) {
    switch (action.type) {
    default:
        return state;
    }
}

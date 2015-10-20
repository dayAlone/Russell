const initialState = {
    list: [
        {
            title: '5 Элемент',
            image: '/layout/images/store-14.jpg',
            link: 'http://5element.su/search/index.php?q=RUSSELL+HOBBS&s=%A0',
            color: '#20398b'
        },
        {
            title: 'METRO Cash&Carry',
            image: '/layout/images/store-8.jpg',
            link: 'http://www.metro-cc.ru/',
            color: '#002a59'
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
            color: '#f67300'
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
            color: '#74c23b'
        },
        {
            title: 'М.видео',
            image: '/layout/images/store-7.jpg',
            link: 'http://www.mvideo.ru/product-list?Ntt=russell%20hobbs&Nty=1&Dy=1&Nrpp=24&_requestid=227233',
            color: '#ffffff'
        },
        {
            title: 'МедиаМаркт',
            image: '/layout/images/store-5.jpg',
            link: 'https://www.mediamarkt.ru/search?q=russell+hobbs',
            color: '#e4007b'
        },
        {
            title: 'Озон',
            image: '/layout/images/store-3.jpg',
            link: 'http://www.ozon.ru/?context=search&text=russell+hobbs',
            color: '#ffffff'
        },
        {
            title: 'МаксидоМ',
            image: '/layout/images/store-1.jpg',
            link: 'http://www.maxidom.ru/search/catalog.php?q=RUSSELL+HOBBS&category_search=',
            color: '#d2151d'
        },
        {
            title: 'Техносила',
            image: '/layout/images/store-13.jpg',
            link: 'http://www.tehnosila.ru/search?q=russell+hobbs',
            color: '#ffffff'
        },
        {
            title: 'Эльдорадо',
            image: '/layout/images/store-12.jpg',
            link: 'http://www.eldorado.ru/search/catalog.php?q=RUSSELL+HOBBS',
            color: '#e00015'
        },
        {
            title: 'Юлмарт',
            image: '/layout/images/store-10.jpg',
            link: 'http://www.ulmart.ru/search?string=russell+hobbs&rootCategory=&sort=6',
            color: '#ffffff'
        },
        {
            title: 'Энтер',
            image: '/layout/images/store-11.jpg',
            link: 'http://www.enter.ru/search?q=russell+hobbs',
            color: '#000000'
        }
    ]
};

export default function(state = initialState, action) {
    switch (action.type) {
    default:
        return state;
    }
}

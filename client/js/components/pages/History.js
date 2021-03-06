import React, { Component } from 'react'
import Typograf from 'typograf'
import Helmet from 'react-helmet'

import Title from '../layout/Title'
import Carousel from '../ui/Carousel'
import Breadcrumbs from '../ui/Breadcrumbs'


class PageHistorySlider extends Component {
    state = {
        dates: [
            { year: '1952', text: 'Билл Расселл и Питер Хоббс создают компанию Russell Hobbs и первую кофеварку серии СР1 с функцией подогрева.' },
            { year: '1955', text: 'Изобретение первого в мире автоматического электрического чайника K1.' },
            { year: '1967', text: 'Объемы производства превышают один миллион единиц продукции.' },
            { year: '1975', text: 'Компания Russell Hobbs производит более 5 миллионов единиц продукции.' },
            { year: '1977', text: 'Компания Russell Hobbs становится лидирующим мировым производителем чайников и крупнейшим производителем кофеварок и тостеров в Великобритании.' },
            { year: '1980', text: 'Представлена машина для приготовления чая Chelsea Tea Machine с революционной однокамерной системой.' },
            { year: '1995', text: 'Начинается производство тостера Classiс, который вскоре становится самым известным и самым продаваемым тостером в Великобритании. Сейчас он считается самым продаваемым тостером в истории.' },
            { year: '1996', text: 'Начинается производство чайника Millennium с изготовленным в Великобритании диском OPTEC, который становится известен как чайник с наименьшим временем закипания воды.' },
            { year: '2000', text: 'Выпускается первый чайник Montana и становится самым продаваемым чайником в Великобритании.' },
            { year: '2004', text: 'Начинается производство удостоенной награды серии продуктов Glass.' },
            { year: '2005', text: 'Компания Russell Hobbs отмечает 50-летие чайника К1.' },
            { year: '2007', text: 'Выпущена ограниченная серия хрустальных тостеров Crystal Glass, украшенных кристаллами Swarovski.' },
            { year: '2008', text: 'Продажи чайников Montana и тостеров Classic Toaster преодолевают барьер в 4 миллиона.' },
            { year: '2009', text: 'Создание фарфорового тостера Porcelain Toaster, совместно с известным дизайнером Дрором Беншетритом и немецким производителем фарфора Rosenthal.' },
            { year: '2010', text: 'Компания Russell Hobbs запускает в производство уникальный паровой утюг Easyfill со специальным отверстием для залива воды в задней части утюга.' },
            { year: '2011', text: 'Russell Hobbs запускает Allure, которая является первой в нашей истории коллекцией с кросс-продукцией в едином стиле в категории «Завтрак» и «Техника для кухни».' },
            { year: '2011', text: 'В производство запускается серия продуктов Steel Touch, представляющая собой первую в мире инновационную серию кухонной техники с системой сенсорного управления в сочетании с эксклюзивным дизайном.' },
            { year: '2012', text: 'Russell Hobbs становится брендом № 1 по продажам утюгов на территории Соединенного Королевства и запускает уникальную инновационную линейку утюгов на европейском рынке.' },
            { year: '2013', text: 'Представлена коллекция утюгов Easy Store, которую отличает ряд инноваций с «умными» решениями по хранению и размещению утюга.' },
            { year: '2014', text: 'Представлена коллекция Illumina с технолщгией Colour Control, которая разработана с целью сделать процесс приготовления простым и наглядным.' },
            { year: '2015', text: 'В честь 60-летия инноваций бренда Russell Hobbs, который создал первый в мире электрический чайник с автоматическим отключением, выпущена юбилейная коллекция приборов для завтрака Legacy. ' }
        ]
    }
    render() {
        let tp = new Typograf({lang: 'ru'})
        return <div className='history'>
            <h2 className='history__title'>Детали</h2>
            <Carousel className='history__slider' slideToShow='1' arrowsType='black'>
                {this.state.dates.map((item, i) => {
                    const { year, text } = item
                    return <div key={i}><div className='history__item'>
                            <div className='history__content'>
                                <div className='history__year'>{year}</div>
                                <div className='history__divider'></div>
                                <div className='history__text'>{tp.execute(text)}</div>
                            </div>
                        </div>
                    </div>
                })}
            </Carousel>
        </div>
    }
}

class PageHistory extends Component {
    render() {
        return <div className='page page--history'>
                <Helmet title='Russell Hobbs | История бренда' />
                <Title />
                <Breadcrumbs routes={this.props.routes} />
                <div className='text'>
                    <p>Продукция RUSSELL HOBBS предлагает не просто качество, стиль и инновации – она помогает придать приятным моментам вашей жизни восхитительный вкус.</p>

                    <p>Первая чашка кофе утром, тепло свежевыглаженной рубашки, улыбка удовольствия от аромата свежей выпечки – вот те моменты, которые действительно имеют значение, моменты истинной радости. Это уникальный опыт, который ежедневно создается нашей продукцией.</p>

                    <p>Потребитель в сердце всего, что мы делаем, всего, что вдохновляет нас делать мир окружающих его вещей лучше. От чайников и утюгов до техники для приготовления пищи, вся наша продукция — это стильное решение, которое делаeт быт легче. Мы работаем, думая о людях, создавая приборы, которые делают жизнь в вашем доме еще более приятной.</p>

                    <p><strong>Мы — Russell Hobbs. В сердце вашего дома.</strong></p>
                    <h2>История успеха RUSSELL HOBBS</h2>

                    <p>Наша история началась в 1952 году, когда инженеры, работавшие на различные компании по производству бытовых приборов, Билл Расселл и Питер Хоббс, объединились, чтобы вместе создавать кухонные приборы для Великобритании. Их идея была проста: создавать продукты, которые делают быт легче и приятнее.</p>

                    <p>Первой их совместной разработкой стала первая в мире кофеварка, которая умела поддерживать напиток теплым. Продукция Russell Hobbs мгновенно завоевала популярность, благодаря уникальному сочетанию технологических инноваций, высокого качества и яркого дизайна.</p>

                    <p>1955 год стал переломным в жизни компании – именно в 1955 году Russell Hobbs подарил миру первый в электрический чайник – модель «К1».</p>

                    <p>В 1960 году, больше полувека назад, Russell Hobbs выпустил на рынок следующую модель электрического чайника – «К2». Этот легендарный чайник был почти на каждой английской кухне того времени и заслуженно заработал звание «самого популярного чайника 60-х и 70-х годов».</p>

                    <p>Ассортимент и объем продаж все время росли, и уже к 1975 году Russell Hobbs продал около 5 миллионов единиц продукции, а к 1977 году бренд завоевал уверенное мировое лидерство в производстве электрических чайников.</p>

                    <p>«Без Russell Hobbs кухня – не кухня!» - гласили рекламные плакаты того времени. Этот слоган не устарел и сегодня – объем продаж компании давно измеряется миллионами единиц продукции, ассортимент позволяет полностью укомплектовать дом и кухню самой привередливой хозяйки, а дизайн техники Russell Hobbs продолжает завоевывать призы на самых престижных конкурсах.</p>

                    <p>Бренд развивается и никогда не стоит на месте. Отметив 60-летний юбилей со дня создания первой инновации, компания Russell Hobbs гордится тем, что является маркой №1 в Великобритании, продолжая успешно покорять Европу и весь мир.</p>
                    <p><strong>Мы — Russell Hobbs. В сердце вашего дома.</strong></p>
                </div>
                <PageHistorySlider />
        </div>
    }
}

export default PageHistory

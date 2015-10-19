import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Title from '../layout/Title';
import ShareLove from '../ShareLove';
import Categories from '../Categories';

class PageCatalog extends Component {
    render() {
        return <div className='page page--index'>
            <Title />
            <Helmet title={'Russell Hobbs | Коллекции'}/>
            <Categories source='collections' routes={this.props.routes}>
                <div className='text text--small'>
                    <h2>Коллекции</h2>
                    <p><strong>В сердце каждого дома, тогда и сейчас</strong></p>

                    <p>История нашей компании берет начало в 1952 году, когда Билл Рассел и Питер Хоббс объединились с целью революционного изменения привычного облика кухонь по всей Великобритании. Их концепция была проста: создавать продукцию, которая сделает повседневную жизнь более легкой и будет дарить людям радость. Первый электрический чайник положил начало серии многих инновационных изобретений компании «Russell Hobbs».</p>

                    <p>Сегодня, как и прежде, желания и потребности потребителей лежат в основе тех принципов, которым следует компания «Russell Hobbs». Стараясь быть ближе к потребителю, мы обретаем опыт, помогающий нам непрерывно совершенствоваться. От сложных инновационных сенсорных технологий управления до простых съемных элементов бытовой техники, которые можно мыть в посудомоечной машине – в основе каждого нашего продукта лежат практичные решения, которые помогают привносить радость в повседневную жизнь людей. Ведь для большинства наших потребителей это самое главное.</p>

                    <p>В свой 60-летний юбилей компания «Russell Hobbs» по праву гордится статусом компании №1 по производству бытовых электроприборов в Великобритании. Наша продукция уже завоевала европейский рынок и продолжает набирать популярность во всем мире. Мы рады иметь возможность занять заветный уголок в сердце каждого дома, в какой бы части света он ни находился.</p>


                </div>
            </Categories>
            <ShareLove />
        </div>;
    }
}

export default PageCatalog;

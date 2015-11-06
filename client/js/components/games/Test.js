import React, { Component } from 'react'
class Test extends Component {
    state = {
        url: 'http://164623.selcdn.com/russell/layout/images/test',
        rules: false,
        isStarted: false,
        level: -1,
        time: 0,
        questions: [
            {
                question: 'Какой из этих предметов техники был создан Russell Hobbs?',
                images: [
                    {
                        src: '/layout/images/kitchen/sku/2/6.png',
                        right: true
                    },
                    {
                        src: '/layout/images/kitchen/sku/custom/18.png'
                    }
                ],
                answers: [
                    {
                        text: 'Левый',
                        right: true
                    },
                    {
                        text: 'Правый'
                    },
                    {
                        text: 'Оба'
                    },
                    {
                        text: 'Ни один'
                    },
                ]
            }
        ],
        current: 0
    }
    startGame(e) {
        this.setState({
            level: 0,
            isStarted: true
        })
        if (e) e.preventDefault()
    }
    toggleRules(status) {
        return (e) => {
            this.setState({rules: status})
            e.preventDefault()
        }
    }
    render() {
        let {isStarted, level, time, rules, questions, current} = this.state
        let {question, answers} = questions[current]
        return <div className='game'>
            <h1 className='game__title center'>История в деталях</h1>
            <div className='test'>
                { rules ?
                    <div className='test__rules'>
                        <a href='#' onClick={this.toggleRules(false)} className='test__close'><img src='/layout/images/svg/close.svg' alt='' /></a>
                        <div className='center'>
                            <h2>Правила игры</h2>
                        </div>

                        <img src='/layout/images/line.png' alt='' className='test__divider' />
                        <p>Каждый тест состоит из 16 вопросов  на знание истории и техники Russell Hobbs. </p>
                        <p>На прохождение одного теста вам дается 120 секунд.</p>
                        <p>Время, за которое вы пройдете тест, определяется как базовое.</p>
                        <p>За каждый правильный ответ из базового времени вычитается 1 секунда. За каждый неправильный ответ к базовому времени прибавляется 1 секунда. </p>
                        <p>Количество набранных баллов определяются так – из 120 секунд вычитается ваше базовое время, подсчитанное с учетом секунд за правильные и неправильные ответы. Оставшиеся секунды – это и есть ваши баллы (1 секунда = 1 балл). </p>
                        <p>В день вы можете пройти тест не более 3 раз. </p>
                        <p>По итогам дня формируется ваш рейтинг. Это сумма всех итоговых результатов всех сыгранных раундов. </p>
                        <p>Если вы поделитесь результатом вашей игры за день на своей странице в Facebook или ВКонтакте, вам начисляются дополнительные 5 баллов.</p>
                        <p>Итоги подводятся один раз в две недели. Выигрывают три участника с наибольшим дневным рейтингом за 2 недели. </p>
                        <p>По итогам 2 недель все результаты обнуляются, и начинается следующий двухнедельный игровой тур.</p>
                        <p>Удачи!</p>
                        <div className='center'>
                            <a href='#' className='button' onClick={this.toggleRules(false)}>Ознакомился</a>
                        </div>
                    </div>
                    : null }
                {!isStarted ?
                    <div className='test__placeholder'>
                        { level === -1 ?
                            <div>
                                <p>Вопрос, с которого все начинается – когда? Наша история началась больше 60 лет назад, когда мы придумали прибор, ставший для того времени событием. С тех пор мы стараемся все наши приборы, к ак и каждую из составляющих их деталей, создавать такими, чтобы они были достойны стать частью истории. </p>
                                <p>История складывается из событий, техника состоит из деталей, а ваша победа сложится из правильных ответов на наши вопросы. Участвуйте в игре «История в деталях» и выигрывайте! Или просто получайте удовольствие. И это уже без вопросов.</p>
                                <p><strong>Примите участие в игре с 9 ноября по 30 декабря.</strong></p>
                                <img src='/layout/images/line.png' alt='' className='test__divider' />

                                <a href='#' onClick={this.startGame.bind(this)} className='button'>Начать игру</a><br/>
                                <a href='#' onClick={this.toggleRules(true)}>Правила игры</a>
                            </div>
                            :
                            <div>
                                <h2>Поздравляем!</h2>
                                <img src='/layout/images/line.png' alt='' className='test__divider' />
                                <h3>{level !== 2 ? 'Вы завершили уровень со счетом:' : 'Вы прошли все уровни и набрали:'}</h3>
                                <span className='test__block test__block--inline'>
                                    <span>Осталось<br/>попыток</span>
                                    <div className='test__score'>
                                        3
                                    </div>
                                </span>
                                <span className='test__score test__score--big'>{time}</span>


                                <img src='/layout/images/line.png' alt='' className='test__divider' />
                                <a href='#' onClick={this.startGame.bind(this)} className='button'>
                                    {level !== 2 ? 'Продолжить' : 'Сыграть еще раз'}
                                </a>
                            </div>
                        }
                    </div>

                    : <div>
                        <div className='test__ui'>
                            <div className='test__col'>
                                <span className='test__block test__block--inline'>
                                    <div className='test__score'>
                                        {time}
                                    </div>
                                    <span>Осталось<br/>времени</span>
                                </span>
                            </div>
                            <div className='test__col'>
                                <span className='test__block test__block--inline'>
                                    <span>Осталось<br/>попыток</span>
                                    <div className='test__score'>
                                        3
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className='test__placeholder test__placeholder--question'>
                            <h3>{question}</h3>
                            <img src='/layout/images/line.png' alt='' className='test__divider' />
                            <div className='test__answers'>
                                {answers.map((el, i) => {
                                    let {type, src, text} = el
                                    return <a href='#' className='test__answer' key={i}>
                                        {type === 'image' ? <img src={src} alt='' /> : text}
                                    </a>
                                })}

                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    }
}
export default Test

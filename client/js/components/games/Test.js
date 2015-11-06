import React, { Component } from 'react'
import IconSVG from 'svg-inline-loader/lib/component.jsx'
import db from './questions'
class Test extends Component {
    state = {
        url: 'http://164623.selcdn.com/russell/layout/images/test',
        rules: false,
        isStarted: false,
        level: -1,
        timer: false,
        time: 120,
        questions: [],
        current: 0
    }
    shuffle(array) {
        let counter = array.length, temp, index

        while (counter > 0) {
            index = Math.floor(Math.random() * counter)
            counter--
            temp = array[counter]
            array[counter] = array[index]
            array[index] = temp
        }

        return array
    }
    tick() {
        if (parseInt(this.state.time, 10) > 0) {
            this.setState({time: this.state.time - 1})
        } else {
            this.stopGame()
        }
    }
    stopGame() {
        let {timer} = this.state
        this.setState({
            isStarted: false,
            timer: false
        })
        clearInterval(timer)
    }
    startGame(e) {
        this.setState({
            level: 0,
            current: 0,
            time: 120,
            isStarted: true,
            timer: setInterval(this.tick.bind(this), 1000)
        })
        if (e) e.preventDefault()
    }
    toggleRules(status) {
        return (e) => {
            this.setState({rules: status})
            e.preventDefault()
        }
    }
    handleClick(status) {
        let { time, current, questions } = this.state
        return (e) => {
            this.setState({
                time: time + ( status ? 1 : -1 )
            }, ()=> {
                if (questions.length > current + 1) {
                    this.setState({
                        current: current + 1
                    })
                } else {
                    this.stopGame()
                }
            })

            e.preventDefault()
        }
    }
    componentDidMount() {
        let result = []
        for (let i = 0; i < 8; i++) {
            for (let a = 0; a < 2; a++) {
                let rand
                switch (i) {
                case 1:
                case 0:
                    rand = parseInt(Math.random() * db[0].length, 10)
                    break
                default:
                    rand = parseInt(Math.random() * db[i].length, 10)
                    result.push(db[i][rand])
                }
            }
        }
        this.setState({questions: this.shuffle(result)})
    }
    getQuestion() {
        let {questions, current} = this.state
        if (questions) {

            let {question, answers, images} = questions[current]
            let long = false
            answers.map(el => {
                if (el.text.length > 20) long = true
            })
            return <div className='test__placeholder test__placeholder--question'>
                <h3>{question}</h3>
                <img src='/layout/images/line.png' alt='' className='test__divider' />
                {images ? <div className='test__images'>
                    {images.map((el, i) => {
                        let {src, right} = el
                        return <a href='#' onClick={this.handleClick(right)} className='test__answer' key={i}>
                            <img src={src} alt='' />
                        </a>
                    })}
                </div> : null}
                { answers ? <div className={`test__answers test__answers--${answers.length} ${long ? 'test__answers--long' : ''}`}>
                        {answers.map((el, i) => {
                            let {text, right} = el
                            return <a href='#' onClick={this.handleClick(right)} className='test__answer' key={i}>
                                <IconSVG src={require('svg-inline!../../../public/images/svg/heart-border.svg')}/>{text}
                            </a>
                        })}
                    </div> : null }
            </div>
        }
        return null
    }
    render() {
        let {isStarted, level, time, rules} = this.state

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
                                <h2>Ваш результат:</h2>
                                <br/>
                                <span className='test__score test__score--big' data-text='Баллов'>{time}</span>
                                <span className='test__score test__score--big' data-text='Место в рейтинге'>325678</span>
                                <img src='/layout/images/line.png' alt='' className='test__divider' />
                                <span className='kitchen__block kitchen__block--inline'>
                                    <span>Осталось попыток<br/>сыграть сегодня</span>
                                    <div className='kitchen__score'>
                                        3
                                    </div>
                                </span>
                                <span className='kitchen__block kitchen__block--inline'>
                                    <div className='kitchen__score'>
                                        1 554
                                    </div>
                                    <span>набрано баллов<br/>до розыгрыша</span>

                                </span><br/>
                                <a href='#' onClick={this.startGame.bind(this)} className='button'>
                                    Сыграть еще раз
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
                        {this.getQuestion()}
                    </div>
                }
            </div>
        </div>
    }
}
export default Test

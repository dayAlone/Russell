/*global _*/
import React, { Component } from 'react'
import IconSVG from 'svg-inline-loader/lib/component.jsx'
import db from './questions'

import { connect } from 'react-redux'
import * as actionLogin from '../../actions/login'
import * as actionProfile from '../../actions/profile'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { FacebookButton, VKontakteButton } from 'react-social'

@connect(state => ({isLogin: state.login.isLogin, user: state.login.data, scores: state.profile.scores}), dispatch => ({actions: { login: bindActionCreators(actionLogin, dispatch), profile: bindActionCreators(actionProfile, dispatch)}}))
class Test extends Component {
    state = {
        url: '/layout/images/test2',
        rules: false,
        isStarted: false,
        level: -1,
        timer: false,
        time: 120,
        questions: [],
        current: 0,
        locked: false,
        shares: {
            fb: false,
            vk: false
        },
        stat: {
            games: 20,
            scores: 0,
            position: 0
        }
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
        this.createQuestions()
        let {timer, time} = this.state
        this.props.actions.profile.updateGame(this.props.scores.test.today[0]._id, { scores: time, finished: true})
        this.setState({
            isStarted: false,
            timer: false
        })
        clearInterval(timer)
    }
    startGame(e) {
        let {isLogin, actions} = this.props
        for (let type in this.state.shares) clearInterval(this.state.shares[type])

        if (isLogin) {
            actions.profile.startGame('test', true)
            this.setState({
                level: 0,
                current: 0,
                time: 120,
                isStarted: true,
                timer: setInterval(this.tick.bind(this), 1000),
                shares: {
                    fb: false,
                    vk: false
                }
            })
        } else {
            actions.login.openModal()
        }
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
            $(e.currentTarget).addClass(status ? 'test__answer--true' : 'test__answer--wrong')
            $('.test__answers').addClass('.test__answers--block')
            setTimeout(() => {
                $('a.test__answer').removeClass('test__answer--wrong test__answer--true')
                $('.test__answers').removeClass('.test__answers--block')
                this.setState({
                    time: time + ( status ? 1 : -5 )
                }, ()=> {
                    if (questions.length > current + 1) {
                        this.setState({
                            current: current + 1
                        })
                    } else {
                        this.stopGame()
                    }
                })
            }, 300)

            e.preventDefault()
        }
    }
    handleShare(type, url) {
        let request
        let _id = this.props.scores && this.props.scores.test ? this.props.scores.test.today[0]._id : null
        return () => {
            let {shares} = this.state
            if (!shares[type]) {
                switch (type) {
                case 'vk':
                    if (!window.VK) window.VK = {}
                    window.VK.Share = {
                        count: (idx, number) => {
                            if (number > 0) this.updateShare('vk', _id)
                        }
                    }
                    shares['vk'] = setInterval(()=>{
                        request = `http://vk.com/share.php?act=count&url=${url}`
                        $.getScript(request)
                    }, 3000)
                    break
                case 'fb':
                default:
                    url = encodeURIComponent(url)
                    shares['fb'] = setInterval(()=>{
                        request = `https://graph.facebook.com/?id=${url}`
                        $.getJSON(request, (result) => {
                            let number = result.shares ? result.shares : 0
                            //console.log('fb share ' + number, result)
                            //console.log(url)
                            if (number > 0) this.updateShare('fb', _id)
                        })
                    }, 3000)
                    break
                }
                this.setState({
                    shares: shares
                })
            }
        }
    }
    updateShare(type, id) {
        let {shares, time} = this.state

        clearInterval(shares[type])
        shares[type] = true

        time += 5

        this.props.actions.profile.updateGame(id, { scores: time, share: shares })

        this.setState({
            shares: shares,
            time: time
        })
    }
    componentDidMount() {
        if (this.props.isLogin) this.props.actions.profile.getScores()
        if (this.props.scores) this.checkLocked()
        this.createQuestions()
    }
    componentWillUnmount() {
        for (let type in this.state.shares) clearInterval(this.state.shares[type])
    }
    componentDidUpdate(prevProps) {
        if (this.props.isLogin && !this.props.scores) this.props.actions.profile.getScores()
        if ((this.props.scores && !prevProps.scores)
            || (prevProps.scores && prevProps.scores.test &&
                (prevProps.scores.test.total !== this.props.scores.test.total
                    || prevProps.scores.test.count !== this.props.scores.test.count))
                ) {
            this.checkLocked()
        }
    }
    checkLocked() {
        if (this.props.scores.test) {
            let {count, total, position} = this.props.scores.test
            this.setState({
                locked: count >= 20,
                stat: {
                    games: 20 - count,
                    scores: total,
                    position: position
                }
            })
        }
    }
    createQuestions() {
        let _db = db
        let result = []
        for (let i = 0; i < 3; i++) {
            let items = _db[0]
            for (let a = 0; a < 5; a++) {
                let q = parseInt(Math.random() * items.list.length - 1, 10)
                let t = parseInt(Math.random() * items.files.length - 1, 10)
                let t2 = parseInt(Math.random() * items.files.length - 1, 10)
                while (t2 === t) t2 = parseInt(Math.random() * items.files.length - 1, 10)
                let b = parseInt(1 + Math.random() * items.files[t], 10)
                let b2 = parseInt(1 + Math.random() * items.files[t2], 10)
                let images, answers
                switch (i) {
                case 0:
                    images = this.shuffle([{src: `${this.state.url}/${t}/0.png`, right: true}, {src: `${this.state.url}/${t}/${b}.png`}])
                    answers = [
                        {
                            text: 'Левый',
                            right: images[0].right ? true : false
                        },
                        {
                            text: 'Правый',
                            right: images[1].right ? true : false
                        },
                        {text: 'Оба'}, {text: 'Ни один'}]
                    break
                case 1:
                    images = this.shuffle([{src: `${this.state.url}/${t}/0.png`}, {src: `${this.state.url}/${t2}/0.png`}])
                    answers = [
                        {text: 'Левый'},
                        {text: 'Правый'},
                        {text: 'Оба', right: true},
                        {text: 'Ни один'}]
                    break
                default:
                    images = this.shuffle([{src: `${this.state.url}/${t}/${b}.png`}, {src: `${this.state.url}/${t2}/${b2}.png`}])
                    answers = [
                        {text: 'Левый'},
                        {text: 'Правый'},
                        {text: 'Оба'},
                        {text: 'Ни один', right: true}]
                    break
                }
                _db[1].push({
                    question: _db[0].list[q],
                    answers: answers,
                    images: images
                })
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let a = 0; a < 2; a++) {
                switch (i) {
                case 0:
                    let q = parseInt(Math.random() * _db[0].list.length, 10)
                    let t = parseInt(Math.random() * _db[0].files.length, 10)
                    let b = parseInt(1 + Math.random() * _db[0].files[t], 10)

                    result.push({
                        question: _db[0].list[q],
                        answers: [],
                        images: this.shuffle([{
                            src: `${this.state.url}/${t}/0.png`,
                            right: true
                        },
                        {
                            src: `${this.state.url}/${t}/${b}.png`
                        }])
                    })
                    break
                default:
                    let rand = parseInt(Math.random() * _db[i].length - 1, 10)
                    result.push(_db[i][rand])
                    _db[i] = _.without(_db[i], _db[i][rand])

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
                        return <a href='#' onClick={this.handleClick(right)} className='test__answer test__answer--image' key={i}>
                            <img src={src} alt='' />
                            <IconSVG src={require('svg-inline!../../../public/images/svg/heart-border.svg')}/>
                        </a>
                    })}
                </div> : null}
                { answers ? <div className={`test__answers test__answers--${answers.length} ${long ? 'test__answers--long' : ''}`}>
                        {answers.map((el, i) => {
                            let {text, right} = el
                            return <a href='#' onClick={this.handleClick(right)} className='test__answer' key={i}>
                                <IconSVG src={require('svg-inline!../../../public/images/svg/heart-border.svg')}/> <span>{text}</span>
                            </a>
                        })}
                    </div> : null }
            </div>
        }
        return null
    }
    getRulesScreen() {
        return <div className='test__rules'>
            <a href='#' onClick={this.toggleRules(false)} className='test__close'><img src='/layout/images/svg/close.svg' alt='' /></a>
            <div className='center'>
                <h2>Правила игры</h2>
            </div>

            <img src='/layout/images/line.png' alt='' className='test__divider' />
            <p>Каждый тест состоит из 16 вопросов на знание истории и техники Russell Hobbs.</p>
            <p>На прохождение одного теста вам дается 120 секунд.</p>
            <p>Секунды, которые остались у вас после завершения теста, это и есть ваши баллы. 1 секунда = 1 балл. За правильный ответ вам прибавляется 1 балл. За неправильный ответ из вашего результата вычитается 5 баллов.</p>
            <p>Если вы поделитесь результатом прохождения теста на своей странице в Facebook или ВКонтакте, вам начисляются дополнительные 5 баллов. Баллы начисляются за каждый результат, которым вы поделились. Вы должны сохранять результаты попыток на своей странице вплоть до розыгрыша, иначе дополнительные баллы будут вычтены из общего количества баллов.</p>
            <p>Итоговый результат игрока – это сумма баллов за все использованные игровые попытки плюс дополнительные баллы за размещение результатов попыток прохождения в социальных сетях. </p>
            
            <p>Удачи!</p>
            <div className='center'>
                <a href='#' className='button' onClick={this.toggleRules(false)}>Ознакомился</a>
            </div>
        </div>
    }
    getStartScreen() {
        return <div>
            <p>Вопрос, с которого все начинается – когда? Наша история началась больше 60 лет назад, когда мы придумали прибор, ставший для того времени событием. С тех пор мы стараемся все наши приборы, как и каждую из составляющих их деталей, создавать такими, чтобы они были достойны стать частью истории. </p>
            <p>История складывается из событий, техника состоит из деталей, а ваша победа сложится из правильных ответов на наши вопросы. Участвуйте в игре «История в деталях» и проверьте свои знания о Russell Hobbs!</p>
            
            <img src='/layout/images/line.png' alt='' className='test__divider' />

            <a href='#' onClick={this.startGame.bind(this)} className='button'>Начать игру</a><br/>
            <a href='#' onClick={this.toggleRules(true)}>Правила игры</a><br/>
            
        </div>
    }
    getResultsScreen() {
        let { time, stat, shares } = this.state
        let { games, scores, position } = stat
        let _id = ''
        if (this.props.scores && this.props.scores.test) _id = this.props.scores.test.today[0]._id
        let url = `http://${document.domain}/games/test/${_id}`
        return <div className='test__result'>
            <h2>Ваш результат:</h2>
            <br/>
            <span className='test__score test__score--big' data-text='Баллов'>
                {time}
            </span>
            
            {shares.fb !== true || shares.vk !== true ? <div>
                <img src='/layout/images/line.png' alt='' className='test__divider' />
                <div className='test__share'>
                    <div className='test__share-title'>Поделись результатом с друзьями<br/> и получи дополнительные баллы</div>
                    {shares.fb !== true ? <FacebookButton url={url} className='fb' onClick={this.handleShare('fb', url)}> <img src='/layout/images/svg/fb.svg' alt='' /></FacebookButton> : null }
                    {shares.vk !== true ? <VKontakteButton url={url} className='vk' onClick={this.handleShare('vk', url)}> <img src='/layout/images/svg/vk.svg' alt='' /></VKontakteButton> : null }
                    <div className='test__share-scores'>
                        <span>+5</span> баллов
                    </div>
                </div>
            </div> : null }
            <img src='/layout/images/line.png' alt='' className='test__divider' />
            <span className='kitchen__block kitchen__block--inline'>
                <span>Осталось попыток<br/></span>
                <div className='kitchen__score'>
                    {games}
                </div>
            </span>
            <span className='kitchen__block kitchen__block--inline'>
                <div className='kitchen__score'>
                    {scores}
                </div>
                <span>набрано баллов<br/></span>

            </span><br/>
            {games > 0 ? <a href='#' onClick={this.startGame.bind(this)} className='button'>
                    Сыграть еще раз
                </a> : null }
        </div>
    }
    getGameScreen() {
        let { time, stat } = this.state
        let { games } = stat
        return <div>
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
                            {games}
                        </div>
                    </span>
                </div>
            </div>
            {this.getQuestion()}
        </div>
    }
    getLockedScreen() {
        return <div className='test__placeholder center'>
            <h4>{this.props.user.displayName},<br /> вы использовали все 20 игровых попыток. <br/>
            </h4>
            <Link to='/games/' className='button button--top'>Вернуться в раздел</Link>
        </div>
    }
    render() {
        let {isStarted, locked, level, rules} = this.state
        return <div className='game'>
            <h1 className='game__title center'>История в деталях</h1>
            <div className='test'>
                { rules ? this.getRulesScreen() : null }
                { locked && level === -1
                    ? this.getLockedScreen()
                    :
                    ( !isStarted ?
                        <div className='test__placeholder'>
                            { level === -1 ? this.getStartScreen() : this.getResultsScreen() }
                        </div>
                        : this.getGameScreen()
                    )
                }
                <div className='test__no-mobile'><span>Поверните устройство</span></div>
            </div>
        </div>
    }
}
export default Test

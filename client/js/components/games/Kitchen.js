/*global _*/
import React, { Component } from 'react'

import { connect } from 'react-redux'
import * as actionLogin from '../../actions/login'
import * as actionProfile from '../../actions/profile'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { FacebookButton, VKontakteButton } from 'react-social'

@connect(state => ({isLogin: state.login.isLogin, user: state.login.data, scores: state.profile.scores}), dispatch => ({actions: { login: bindActionCreators(actionLogin, dispatch), profile: bindActionCreators(actionProfile, dispatch)}}))
class Kitchen extends Component {
    state = {
        url: 'http://164623.selcdn.com/russell/layout/images/kitchen',
        rules: false,
        cont: false,
        timeout: false,
        isStarted: false,
        loader: {
            active: false,
            percentage: 0
        },
        level: -1,
        active: [],
        active_elements: {},
        elements: [],
        scores: {
            current: 0,
            total: 0
        },
        shares: {
            fb: false,
            vk: false
        },
        time: 0,
        timers: {
            open: false,
            scores: false
        },
        clicks: {},
        settings: [
            {
                boxes: 12,
                sku: 6,
                code: 'white',
                time: 45,
                events: 60,
                empty: 0,
                multiply: 1,
                open: 2000
            },
            {
                boxes: 14,
                sku: 8,
                code: 'black',
                time: 50,
                events: 80,
                empty: 0,
                multiply: 2,
                open: 1750
            },
            {
                boxes: 16,
                sku: 10,
                code: 'red',
                time: 55,
                events: 130,
                empty: 30,
                multiply: 3,
                open: 1500
            }
        ],
        locked: false,
        stat: {
            games: 3,
            scores: 0,
            position: 0
        }
    }
    componentWillUnmount() {
        for (let type in this.state.shares) clearInterval(this.state.shares[type])
    }
    componentDidMount() {
        if (this.props.isLogin) this.props.actions.profile.getScores()
        if (this.props.scores) this.checkLocked()
    }
    componentDidUpdate(prevProps) {
        if (this.props.isLogin && !this.props.scores) this.props.actions.profile.getScores()
        if ((this.props.scores && !prevProps.scores)
            || (prevProps.scores && prevProps.scores.kitchen &&
                (prevProps.scores.kitchen.total !== this.props.scores.kitchen.total
                    || prevProps.scores.kitchen.count !== this.props.scores.kitchen.count))
                ) {
            this.checkLocked()
        }
    }
    handleShare(type, url) {
        let request
        let _id = this.props.scores && this.props.scores.kitchen ? this.props.scores.kitchen.today[0]._id : null
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
        let {shares, scores} = this.state

        clearInterval(shares[type])
        shares[type] = true

        scores.current += 5
        scores.total += 5

        this.props.actions.profile.updateGame(id, { scores: scores.total, share: shares })

        this.setState({
            shares: shares,
            scores: scores
        })
    }
    checkLocked() {
        if (this.props.scores.kitchen) {
            let {today, total, position} = this.props.scores.kitchen
            let {_id, finished, scores, level, share} = today[0]
            let {updateGame} = this.props.actions.profile

            let fields = {
                locked: today.length >= 3 && finished,
                stat: {
                    games: 3 - today.length,
                    scores: total,
                    position: position
                },
                shares: share
            }
            if (this.state.level === -1) {
                if (!finished && level !== 2) {
                    fields = Object.assign({}, fields, {
                        cont: true,
                        level: level,
                        scores: {
                            current: 0,
                            total: scores
                        }
                    })
                } else {
                    updateGame(_id, {scores: scores, finished: true})
                }
            }
            this.setState(fields)
        }
    }
    tickBox() {
        let numbers = []
        let {settings, level, active, active_elements, elements} = this.state
        for (let i = 1; i <= settings[level].boxes; i++) {
            if (active.indexOf(i) === -1 ) {
                numbers.push(i)
            }
        }
        let rand = parseInt(Math.random() * numbers.length, 10)
        active.push(numbers[rand])
        active_elements[numbers[rand]] = elements[0]
        setTimeout(() => {
            this.setState({active: _.without(this.state.active, numbers[rand])})
        }, settings[level].open)
        this.setState({
            active: active,
            active_elements: active_elements,
            elements: elements.slice(1)
        })

    }
    tickTime() {
        if (parseInt(this.state.time, 10) > 0) {
            this.setState({time: this.state.time - 1})
        } else {
            this.stopGame()
        }
    }
    tickTimeout() {
        let { settings, level, timeout, timers } = this.state
        if (timeout === 1) {
            clearTimeout(timers.timeout)
            this.setState({
                timeout: false,
                timers: {
                    timeout: false,
                    open: setInterval(this.tickBox.bind(this), settings[level].time / settings[level].events * 1000),
                    scores: setInterval(this.tickTime.bind(this), 1000)
                }
            })
        } else {
            this.setState({timeout: timeout - 1})
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
    preloadImages(images, i) {
        let index = i || 0
        if (index === 0) {
            this.setState({
                loader: {
                    active: true,
                    percentage: 0
                }
            })
        }
        if (images && images.length > index) {
            let img = new Image()
            img.onload = () => {
                this.setState({
                    loader: {
                        active: true,
                        percentage: parseInt(index / images.length * 100, 10)
                    }
                })
                this.preloadImages(images, index + 1)
            }
            img.src = images[index]
        } else {

            this.setState({
                isStarted: true,
                timeout: 5,
                timers: {
                    timeout: setInterval(this.tickTimeout.bind(this), 1000),
                    open: false,
                    scores: false
                },
                loader: {
                    active: false,
                    percentage: 0
                }
            })
        }
    }
    startGame(e) {
        let {isLogin, actions } = this.props
        if (isLogin) {
            let {settings, level, scores, cont, shares} = this.state
            let {updateGame, startGame} = actions.profile

            if (level >= 2) {
                for (let type in this.state.shares) clearInterval(this.state.shares[type])
                level = 0
                scores = {
                    current: 0,
                    total: 0
                }
                shares = {
                    fb: false,
                    vk: false
                }
            } else {
                level++
            }
            if (level === 0 && !cont) startGame('kitchen', false)
            else {
                let {today} = this.props.scores.kitchen
                updateGame(today[0]._id, {scores: scores.total, finished: false, level: level})
            }

            this.setState({
                cont: false,
                time: settings[level].time,
                scores: scores,
                level: level,
                shares: shares,
            }, this.makeElements)

            /*
            window.onbeforeunload = (e) => {
                e = e || window.event
                if (e) { e.returnValue = false }
                return false
            }
            */
        } else {
            actions.login.openModal()
        }
        e.preventDefault()
    }
    stopGame() {
        let {timers, scores, time, settings, level} = this.state
        clearInterval(timers.open)
        clearInterval(timers.scores)
        let {updateGame} = this.props.actions.profile

        updateGame(this.props.scores.kitchen.today[0]._id, { scores: scores.total + (settings[level].multiply * time), finished: level === 2, level: level})

        this.setState({
            time: 0,
            clicks: {},
            isStarted: false,
            timers: {
                open: false,
                scores: false
            },
            scores: {
                current: settings[level].multiply * time,
                total: scores.total + (settings[level].multiply * time)
            }
        })
    }
    handleClick(el, id) {
        return (e) => {

            let {clicks, time, active, settings, level} = this.state
            let changes = {
                active: _.without(active, id),
            }
            if ($(e.currentTarget).hasClass('kitchen__box--active')) {
                if (el.type === 'sku') {
                    if (clicks[el.id] > 0 && clicks[el.id] < 3) clicks[el.id]++
                    else if (!clicks[el.id]) clicks[el.id] = 1

                    let counter = 0
                    for (let i in clicks) {
                        counter += clicks[i]
                    }
                    if (counter === settings[level].sku * 3) {
                        this.stopGame()
                    }
                    else changes['clicks'] = clicks
                } else {
                    changes['time'] = time > 0 ? time - 1 : 0
                }
                this.setState(changes)
            }
        }
    }
    makeBoxes() {
        let {level, settings, active, active_elements, url} = this.state
        let boxes = []
        if (level >= 0) {
            for (let i = 1; i <= settings[level].boxes; i++) {
                boxes.push(<div onClick={this.handleClick(active_elements[i], i)} key={i} className={`kitchen__box kitchen__box--${i} ${active.indexOf(i) !== -1 ? 'kitchen__box--active' : ''}`}>
                    <img src={`${url}/${settings[level].code}/box-${i}.png`} alt='' />
                    {active.indexOf(i) !== -1 ?
                        active_elements[i] && active_elements[i].type !== 'empty'
                            ? <img src={`${url}/sku2/${active_elements[i].type === 'custom' ? 'custom' : level }/${active_elements[i].id}.png`} alt='' className='kitchen__box-content' />
                            : null
                    : null }
                </div>)
            }
        }
        return boxes
    }
    makeSKU() {
        let {level, settings, clicks, url} = this.state
        let sku = []
        if (level >= 0) {

            for (let i = 1; i <= settings[level].sku; i++) {
                sku.push(<div className='kitchen__sku' key={i}>
                    <img src={`${url}/sku2/${level}/inactive/${i}.png`} alt='' />
                    <div className={`kitchen__sku-overlay ${clicks[i] > 0 ? 'kitchen__sku-overlay--' + clicks[i] : ''}`}>
                        <img src={`${url}/sku2/${level}/${i}.png`} alt=''/>
                    </div>
                </div>)
            }
        }
        return sku
    }
    makeElements() {
        let {settings, level, url} = this.state
        let elements = []
        let images = []
        images.push(`${url}/${settings[level].code}/bg.jpg`)
        for (let i = 1; i <= settings[level].boxes; i++) images.push(`${url}/${settings[level].code}/box-${i}.png`)

        for (let i = 1; i <= settings[level].sku; i++) {
            images.push(`${url}/sku2/${level}/${i}.png`)
            images.push(`${url}/sku2/${level}/inactive/${i}.png`)
            for (let a = 0; a < 5; a++) {
                elements.push({
                    type: 'sku',
                    id: i
                })
            }
        }

        for (let i = 1; i <= (settings[level].events - settings[level].empty) / 2; i++) {
            let rand = 1 + parseInt(Math.random() * 12, 10)
            let link = `${url}/sku2/custom/${rand}.png`
            if (images.indexOf(link) === -1) images.push(link)
            elements.push({
                type: 'custom',
                id: rand
            })
        }

        for (let i = 1; i <= settings[level].empty; i++) {
            elements.push({
                type: 'empty'
            })
        }
        this.preloadImages(images)
        this.setState({elements: this.shuffle(elements)})
    }
    toggleRules(status) {
        return (e) => {
            this.setState({rules: status})
            e.preventDefault()
        }
    }
    getRulesScreen() {
        return <div className='kitchen__rules'>
            <a href='#' onClick={this.toggleRules(false)} className='kitchen__close'><img src='/layout/images/svg/close.svg' alt='' /></a>
            <div className='center'>
                <h2>Правила игры</h2>
            </div>

            <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
            <p>Добро пожаловать на нашу виртуальную кухню! В нашей кухне, как и положено, есть множество шкафчиков. За их дверцами спрятаны различные предметы – утварь, банки, коробки, и т. д., в том числе и наша техника.</p>
            <p>Дверцы периодически сами открываются и закрываются. Ваша задача - кликать на технику Russell Hobbs, избегая попадания по другим предметам.</p>
            <p>Если вы кликнули на один прибор Russell Hobbs 3 раза за раунд, то этот прибор считается «собранным» в коллекцию, и его изображение появляется на панели достижений. </p>
            <p>Если вы кликнули на «неправильный» предмет, то получаете штрафной балл. </p>
            <p>Время раунда ограничено. После того, как вы соберете всю коллекцию техники, оставшиеся секунды трансформируются в призовые баллы. При этом штрафные баллы вычитаются из призовых, после чего формируется итоговый результат раунда. </p>
            <p>У нашей игры 3 уровня сложности. За один день вы можете пройти каждый уровень не более 3 раз, то есть не более 9 раз за сутки.</p>
            <p>По итогам дня формируется ваш рейтинг игрока, основанный на сумме всех итоговых результатов всех сыгранных раундов. </p>
            <p>Если вы поделитесь результатом вашей игры за день на своей странице в Facebook или ВКонтакте, вам начисляются дополнительные 5 баллов.</p>
            <p>Итоги игры подводятся один раз в две недели. Выигрывают три участника с наибольшим дневным рейтингом за прошедшие 2 недели. </p>
            <p>По итогам 2 недель все результаты сгорают и начинается следующий 2-х недельный игровой тур.</p>
            <p>Удачи!</p>
            <div className='center'>
                <a href='#' className='button' onClick={this.toggleRules(false)}>Ознакомился</a>
            </div>
        </div>
    }
    getLoadingScreen() {
        let {loader} = this.state
        return <div className='kitchen__placeholder kitchen__placeholder--loader'>
            <h2>Загрузка</h2>
            <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
            <div className='kitchen__loader'>
                <span style={{width: loader.percentage + '%'}}></span>
            </div>
            <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
            <small>Если загрузка идет очень долго, попробуйте обновить страницу</small>
        </div>
    }
    getStartScreen() {
        return <div>
            <p>В кухне все должно быть прекрасно. Для этого в ней, во-первых, должен быть порядок, во-вторых, она должна быть наполнена красивыми вещами. Такими, как техника Russell Hobbs.</p>
            <p>Так что – пришла пора наводить порядок на кухне и подбирать для нее красивые вещи. Вы готовы? Тогда мы приглашаем вас в игру. Мы спрятали на нашей виртуальной кухне разные приборы Russell Hobbs. Вам нужно найти их и собрать. И если в игре вам будет сопутствовать успех, вы выиграете настоящую, а не виртуальную технику, и украсите ею свою кухню!</p>
            <p><strong>Время действия акции - с 9 ноября по 30 декабря.</strong></p>
            <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
            <a href='#' onClick={this.startGame.bind(this)} className='button'>Начать игру</a><br/>
            <a href='#' onClick={this.toggleRules(true)}>Правила игры</a>
        </div>
    }
    getResultsScreen() {
        let { time, stat, level, shares } = this.state
        let { games, scores, position } = stat
        let _id = ''
        if (this.props.scores && this.props.scores.kitchen) _id = this.props.scores.kitchen.today[0]._id
        let url = `http://${document.domain}/games/kitchen/${_id}`
        return <div>
            <h3>{level !== 2 ? 'Ваш результат прохождения уровня:' : 'Ваш результат игры:'}</h3>
            <br/>
            <span className='test__score test__score--big' data-text='Баллов'>
                {level === 2 ? this.state.scores.total : this.state.scores.current}
            </span>
            {level === 2 ? <span className='test__score test__score--big' data-text='Место в рейтинге'>
                {position}
            </span> : null }
            {(shares.fb !== true || shares.vk !== true) && level === 2 ? <div>
                <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                <div className='kitchen__share'>
                    <div className='kitchen__share-title'>Поделись результатом с друзьями<br/> и получи дополнительные баллы</div>
                    {shares.fb !== true ? <FacebookButton url={url} className='fb' onClick={this.handleShare('fb', url)}> <img src='/layout/images/svg/fb.svg' alt='' /></FacebookButton> : null }
                    {shares.vk !== true ? <VKontakteButton url={url} className='vk' onClick={this.handleShare('vk', url)}> <img src='/layout/images/svg/vk.svg' alt='' /></VKontakteButton> : null }
                    <div className='kitchen__share-scores'>
                        <span>+5</span> баллов
                    </div>
                </div>
            </div> : null }
            <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
            <span className='kitchen__block kitchen__block--inline'>
                <span>Осталось попыток<br/>сыграть сегодня</span>
                <div className='kitchen__score'>
                    {games}
                </div>
            </span>
            <span className='kitchen__block kitchen__block--inline'>
                <div className='kitchen__score'>
                    {scores}
                </div>
                <span>набрано баллов<br/>до розыгрыша</span>

            </span><br/>
            {games > 0 ? <a href='#' onClick={this.startGame.bind(this)} className='button'>
                    {level !== 2 ? 'Продолжить' : 'Сыграть еще раз'}
                </a> : null }
        </div>
    }
    getGameScreen() {
        let sku = this.makeSKU()
        let boxes = this.makeBoxes()
        let {level, scores, time, timeout} = this.state
        let {total} = scores

        return <div className={`kitchen__level kitchen__level--${level}`}>
            <div className='kitchen__ui kitchen__ui--left'>
                <div className='kitchen__block'>
                    <span>Сумма баллов</span>
                    <div className='kitchen__score'>
                        {total}
                    </div>
                </div>
                <div className='kitchen__skus'>
                    {sku.splice(0, sku.length / 2)}
                </div>
            </div>
            {boxes}
            {timeout ? <div className='kitchen__timeout'><span>{timeout}</span></div> : null}
            <div className='kitchen__ui kitchen__ui--right'>
                <div className='kitchen__block'>
                    <span>Осталось времени</span>
                    <div className='kitchen__score'>
                        {time}
                    </div>
                </div>
                <div className='kitchen__skus'>
                    {sku.splice(sku.length / 2 - 2)}
                </div>
            </div>
        </div>
    }
    getLockedScreen() {
        return <div className='kitchen__placeholder center'>
            <h4>{this.props.user.displayName},<br /> к сожалению, ваш лимит игр на сегодня достигнут.<br /> Возвращайтесь завтра и продолжайте борьбу за призы!</h4>
            <Link to='/games/' className='button button--top'>Вернуться в раздел</Link>
        </div>
    }
    getContinueScreen() {
        return <div className='kitchen__placeholder center'>
            <h4>{this.props.user.displayName},<br /> вы не закончили игру в прошлый раз.<br/>
            Вам необходимо завершить прохождение всех уровней, чтобы начать игру с начала.</h4>
        <a href='#' className='button button--top' onClick={this.startGame.bind(this)}>Продолжить игру</a>
        </div>
    }
    render() {
        let {isStarted, level, rules, loader, locked, cont} = this.state
        return <div className='game'>
            <h1 className='game__title center'>Собери коллекцию</h1>
            <div className='kitchen'>
                { rules ? this.getRulesScreen() : null }
                { locked && level === -1
                    ? this.getLockedScreen()
                    :
                    ( loader.active ? this.getLoadingScreen() :
                        !isStarted ?
                            <div className='kitchen__placeholder'>
                                { cont ? this.getContinueScreen() : level === -1 ? this.getStartScreen() : this.getResultsScreen() }
                            </div>
                            :
                            this.getGameScreen()
                    )
                }
                <div className='kitchen__no-mobile'><span>Ваш экран слишком мал:(<br/>Скоро будет доступно и на мобильных устройствах </span></div>
            </div>
        </div>
    }
}
export default Kitchen

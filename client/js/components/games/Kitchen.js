/*global _*/
import React, { Component } from 'react'
class Kitchen extends Component {
    state = {
        url: 'http://164623.selcdn.com/russell/layout/images/kitchen',
        rules: false,
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
        ]
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
    preloadImages(images, index) {
        index = index || 0
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
                loader: {
                    active: false,
                    percentage: 0
                }
            })
        }
    }
    startGame(e) {
        let {settings, level, scores} = this.state
        if (level >= 2) {
            level = 0
            scores = {
                current: 0,
                total: 0
            }
        } else {
            level++
        }

        this.setState({
            time: settings[level].time,
            scores: scores,
            level: level,
            times: {
                open: setInterval(this.tickBox.bind(this), settings[level].time / settings[level].events * 1000),
                scores: setInterval(this.tickTime.bind(this), 1000)
            }
        }, this.makeElements)

        /*
        window.onbeforeunload = (e) => {
            e = e || window.event
            if (e) { e.returnValue = false }
            return false
        }
        */
        if (e) e.preventDefault()
    }
    stopGame() {
        let {times, scores, time, settings, level} = this.state
        clearInterval(times.open)
        clearInterval(times.scores)

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
                    changes['time'] = time - 1
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
                            ? <img src={`${url}/sku/${active_elements[i].type === 'custom' ? 'custom' : level }/${active_elements[i].id}.png`} alt='' className='kitchen__box-content' />
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
                    <img src={`${url}/sku/${level}/inactive/${i}.png`} alt='' />
                    <div className={`kitchen__sku-overlay ${clicks[i] > 0 ? 'kitchen__sku-overlay--' + clicks[i] : ''}`}>
                        <img src={`${url}/sku/${level}/${i}.png`} alt=''/>
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
            images.push(`${url}/sku/${level}/${i}.png`)
            images.push(`${url}/sku/${level}/inactive/${i}.png`)
            for (let a = 0; a < 5; a++) {
                elements.push({
                    type: 'sku',
                    id: i
                })
            }
        }

        for (let i = 1; i <= (settings[level].events - settings[level].empty) / 2; i++) {
            let rand = 1 + parseInt(Math.random() * 18, 10)
            let link = `${url}/sku/custom/${rand}.png`
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
    render() {
        let {isStarted, level, scores, time, rules, loader} = this.state
        let {current, total} = scores
        let sku = this.makeSKU()
        let boxes = this.makeBoxes()
        return <div className='game'>
            <h1 className='game__title center'>Собери коллекцию</h1>
            <div className='kitchen'>
                { rules ?
                    <div className='kitchen__rules'>
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
                    : null }
                { loader.active ?
                    <div className='kitchen__placeholder kitchen__placeholder--loader'>
                        <h2>Загрузка</h2>
                        <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                        <div className='kitchen__loader'>
                            <span style={{width: loader.percentage + '%'}}></span>
                        </div>
                        <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                        <small>Если загрузка идет очень долго, попробуйте обновить страницу</small>
                    </div>
                    :
                    !isStarted ?
                        <div className='kitchen__placeholder'>
                            { level === -1 ?
                                <div>
                                    <h2>Собери коллекцию Russell Hobbs</h2>
                                    <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                                    <p>Собери максимальное количество предметов за отведенное время, проверь свою реакцию и полчи ценные призы.</p>
                                    <a href='#' onClick={this.startGame.bind(this)} className='button button--top'>Начать игру</a><br/>
                                    <a href='#' onClick={this.toggleRules(true)}>Правила игры</a>
                                </div>
                                :
                                <div>
                                    <h2>Поздравляем!</h2>
                                    <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                                    <h3>{level !== 2 ? 'Вы завершили уровень со счетом:' : 'Вы прошли все уровни и набрали:'}</h3>
                                    <span className='kitchen__block kitchen__block--inline'>
                                        <span>Осталось<br/>попыток</span>
                                        <div className='kitchen__score'>
                                            3
                                        </div>
                                    </span>
                                    <span className='kitchen__score kitchen__score--big'>{current}</span>
                                    <span className='kitchen__block kitchen__block--inline'>
                                        <span>Сумма<br/>баллов</span>
                                        <div className='kitchen__score'>
                                            {total}
                                        </div>
                                    </span>

                                    <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                                    <a href='#' onClick={this.startGame.bind(this)} className='button'>
                                        {level !== 2 ? 'Продолжить' : 'Сыграть еще раз'}
                                    </a>
                                </div>
                            }
                        </div>

                        :

                        <div className={`kitchen__level kitchen__level--${level}`}>
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
            </div>
        </div>
    }
}
export default Kitchen

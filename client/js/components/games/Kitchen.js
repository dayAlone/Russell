/*global _*/
import React, { Component } from 'react'
class Kitchen extends Component {
    state = {
        isStarted: true,
        level: 0,
        active: [],
        active_elements: {},
        elements: [],
        scores: {
            total: 0,
            current: 0
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
                empty: 0
            },
            {
                boxes: 14,
                sku: 8,
                code: 'black',
                time: 50,
                events: 80,
                empty: 0
            },
            {
                boxes: 16,
                sku: 10,
                code: 'red',
                time: 55,
                events: 130,
                empty: 10
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
        }, 2000)
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
            clearInterval(this.state.times.open)
            clearInterval(this.state.times.scores)
            this.setState({
                time: 0,
                //clicks: {},
                times: {
                    open: false,
                    scores: false
                }
            })
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
    makeElements() {
        let {settings, level} = this.state
        let elements = []
        for (let i = 1; i <= settings[level].sku; i++) {
            for (let a = 0; a < 5; a++) {
                elements.push({
                    type: 'sku',
                    id: i
                })
            }
        }

        for (let i = 1; i <= (settings[level].events - settings[level].empty) / 2; i++) {
            let rand = 1 + parseInt(Math.random() * 18, 10)
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
        this.setState({elements: this.shuffle(elements)})
    }
    componentDidMount() {
        let {settings, level} = this.state

        this.makeElements()
        this.setState({
            time: settings[level].time,
            times: {
                open: setInterval(this.tickBox.bind(this), settings[level].time / settings[level].events * 1000),
                scores: setInterval(this.tickTime.bind(this), 1000)
            }
        })
    }
    handleClick(el, id) {
        return (e) => {

            let {clicks, time, active} = this.state
            let changes = {
                active: _.without(active, id),
            }
            if ($(e.currentTarget).hasClass('kitchen__box--active')) {
                if (el.type === 'sku') {
                    if (clicks[el.id] > 0 && clicks[el.id] < 3) clicks[el.id]++
                    else if (!clicks[el.id]) clicks[el.id] = 1
                    changes['clicks'] = clicks
                } else {
                    changes['time'] = time - 1
                }
                this.setState(changes)
            }
        }
    }
    render() {
        let {isStarted, level, settings, active, active_elements, scores, time, clicks} = this.state
        let {total, current} = scores
        let boxes = []
        for (let i = 1; i <= settings[level].boxes; i++) {
            boxes.push(<div onClick={this.handleClick(active_elements[i], i)} key={i} className={`kitchen__box kitchen__box--${i} ${active.indexOf(i) !== -1 ? 'kitchen__box--active' : ''}`}>
                <img src={`/layout/images/kitchen/${settings[level].code}/box-${i}.png`} alt='' />
                {active.indexOf(i) !== -1 ?
                    active_elements[i] && active_elements[i].type !== 'empty'
                        ? <img src={`/layout/images/kitchen/sku/${active_elements[i].type === 'custom' ? 'custom' : level }/${active_elements[i].id}.png`} alt='' className='kitchen__box-content' />
                        : null
                : null }
            </div>)
        }
        let sku = []
        for (let i = 1; i <= settings[level].sku; i++) {
            sku.push(<div className='kitchen__sku' key={i}>
                <img src={`/layout/images/kitchen/sku/${level}/inactive/${i}.png`} alt='' />
                <div className={`kitchen__sku-overlay ${clicks[i] > 0 ? 'kitchen__sku-overlay--' + clicks[i] : ''}`}>
                    <img src={`/layout/images/kitchen/sku/${level}/${i}.png`} alt=''/>
                </div>
            </div>)
        }
        return <div className='kitchen'>
            {!isStarted ?
                <div className='kitchen__placeholder'>
                    <h2>Собери коллекцию Russell Hobbs</h2>
                    <img src='/layout/images/line.png' alt='' className='kitchen__divider' />
                    <p>Собери максимальное количество предметов за отведенное время, проверь свою реакцию и полчи ценные призы.</p>
                    <a href='#' className='button'>Начать игру</a><br/>
                    <a href='#'>Правила игры</a>
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
    }
}
export default Kitchen

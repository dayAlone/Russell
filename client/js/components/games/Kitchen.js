/*global _*/
import React, { Component } from 'react'
class Kitchen extends Component {
    state = {
        isStarted: true,
        level: 0,
        active: [],
        scores: {
            total: 0,
            current: 0
        },
        time: 0,
        timers: {
            open: false,
            scores: false
        },
        clicks: {
            1: 1,
            2: 2,
            3: 0,
            4: 3,
            5: 0,
            6: 2,
            7: 0,
            8: 0,
            9: 0,
            10: 0
        },
        settings: [
            {
                boxes: 12,
                sku: 6,
                code: 'white',
                time: 45,
                events: 60
            },
            {
                boxes: 14,
                sku: 6,
                code: 'black',
                time: 50,
                events: 80
            },
            {
                boxes: 16,
                sku: 10,
                code: 'red',
                time: 55,
                events: 130
            }
        ]
    }
    tick() {
        let numbers = []
        let {settings, level, active} = this.state
        for (let i = 1; i <= settings[level].boxes; i++) {
            if (active.indexOf(i) === -1 ) {
                numbers.push(i)
            }
        }
        let rand = parseInt(Math.random() * numbers.length)
        active.push(numbers[rand])
        setTimeout(() => {
            this.setState({active: _.without(this.state.active, numbers[rand])})
        }, 1000)
        this.setState({active: active})
    }
    componentDidMount() {
        let {settings, level} = this.state
        setInterval(this.tick.bind(this), settings[level].time / settings[level].events * 1000)
    }
    render() {

        let {isStarted, level, settings, active, scores, time, clicks} = this.state
        let {total, current} = scores
        let boxes = []
        for (let i = 1; i <= settings[level].boxes; i++) {
            boxes.push(<div key={i} className={`kitchen__box kitchen__box--${i} ${active.indexOf(i) !== -1 ? 'kitchen__box--active' : ''}`}>
                <img src={`/layout/images/kitchen-${settings[level].code}-box-${i}.png`} alt='' />
            </div>)
        }
        let sku = []
        for (let i = 1; i <= settings[level].sku; i++) {
            sku.push(<div className='kitchen__sku' key={i}>
                <img src={`/layout/images/sku-bg-${i}.png`} alt='' />
                <div className={`kitchen__sku-overlay ${clicks[i] > 0 ? 'kitchen__sku-overlay--' + clicks[i] : ''}`}>
                    <img src={`/layout/images/sku-${i}.png`} alt='' />
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
                            {sku.splice(sku.length / 2 - 1)}
                        </div>
                    </div>
                </div>
            }
        </div>
    }
}
export default Kitchen

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
        settings: [
            {
                boxes: 12,
                code: 'white',
                time: 45,
            },
            {
                boxes: 14,
                code: 'black',
                time: 50,
            },
            {
                boxes: 16,
                code: 'red',
                time: 55,
            }
        ]
    }
    render() {
        let {isStarted, level, settings, active} = this.state
        let boxes = []
        for (let i = 1; i <= settings[level].boxes; i++) {
            boxes.push(<div className={`kitchen__box kitchen__box--${i} ${active.indexOf(i) !== -1 ? 'kitchen__box--active' : ''}`}>
                <img src={`/layout/images/kitchen-${settings[level].code}-box-${i}.png`} alt='' />
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
                            <span>ОСТАЛОСЬ ПОПЫТОК</span>
                            <div className='kitchen__score'>
                                3
                            </div>
                        </div>
                    </div>
                    {boxes}
                    <div className='kitchen__ui kitchen__ui--right'></div>
                </div>
            }
        </div>
    }
}
export default Kitchen

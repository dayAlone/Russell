import React, { Component } from 'react'

class Dropdown extends Component {
    state = { trigger: this.props.trigger, active: false, error: false }
    onClick(i) {
        return (e) => {
            this.setState({
                trigger: this.props.items[i].name,
                active: i,
                error: false
            })
            e.preventDefault()
        }
    }
    requiredCheck() {
        if (this.state.active === false) {
            this.setState({error: true})
            return false
        }
        this.setState({error: false})
        return true
    }
    render() {
        let {items} = this.props
        return <div className={`dropdown ${this.state.error ? 'dropdown--error' : ''}`}>
            <a href='#' className='dropdown__trigger'>
                {this.state.trigger} <img src='/layout/images/svg/down.svg' alt='' />
            </a>
            <span className='dropdown__frame'>
                {items.map((el, i) => {
                    return <a key={i} onClick={this.onClick(i)} href='#' className='dropdown__item'>{el.name}</a>
                })}
            </span>
            <select className='dropdown__select' value={this.state.active ? (items[this.state.active].code ? items[this.state.active].code : items[this.state.active].name) : null}>
                <option value=''>{this.props.trigger}</option>
                {items.map((el, i) => {
                    return <option
                                value={el.code ? el.code : el.name}
                                key={i}>{el.name}</option>
                })}
            </select>
        </div>
    }
}

export default Dropdown

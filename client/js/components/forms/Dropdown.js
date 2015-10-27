import React from 'react'
import { Mixin } from 'formsy-react'

const Dropdown = React.createClass({

    mixins: [Mixin],
    getInitialState() {
        return {active: false, trigger: this.props.trigger}
    },
    onClick(i) {
        return (e) => {
            let el = this.props.items[i]
            this.setState({
                trigger: el.name,
                active: i,
                error: false
            })
            this.setValue(el.code ? el.code : el.name)
            e.preventDefault()
        }
    },
    render() {
        let {items, title, name} = this.props
        const errorMessage = this.getErrorMessage()
        return <div className='form-group'>
                {title ? <label htmlFor={name}>{title}</label> : null}
                <div className={`dropdown ${this.showError() && !this.isPristine() ? 'dropdown--error' : ''}`}>
                <a href='#' className='dropdown__trigger'>
                    {this.state.trigger} <img src='/layout/images/svg/down.svg' alt='' />
                </a>
                <span className='dropdown__frame'>
                    {items.map((el, i) => {
                        return <a key={i} onClick={this.onClick(i).bind(this)} href='#' className='dropdown__item'>{el.name}</a>
                    })}
                </span>
                <select name={name} className='dropdown__select' value={this.getValue()}>
                    <option value=''>{this.props.trigger}</option>
                    {items.map((el, i) => {
                        return <option
                                    value={el.code ? el.code : el.name}
                                    key={i}>{el.name}</option>
                    })}
                </select>
            </div>
            {errorMessage ? <span className='validation-error'>{errorMessage}</span> : null}
        </div>
    }
})

export default Dropdown
/*

import React, { Component } from 'react'

class Dropdown extends Component {
    state = { trigger: this.props.trigger, active: false, error: false }

    requiredCheck() {
        if (this.state.active === false) {
            this.setState({error: true})
            return false
        }
        this.setState({error: false})
        return true
    }

}

export default Dropdown
*/

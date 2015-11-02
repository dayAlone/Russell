import React from 'react'
import { Mixin } from 'formsy-react'
import { findDOMNode } from 'react-dom'
import hoverintent from 'hoverintent'
const Dropdown = React.createClass({

    mixins: [Mixin],
    getInitialState() {
        return {active: false, trigger: this.props.trigger}
    },
    onClick(i) {
        return (e) => {
            let el = this.props.items[i]
            this.setState({
                trigger: el.name
            })
            $(findDOMNode(this.refs.block)).removeClass('dropdown--hover')
            if (this.props.onChange) this.props.onChange(el, i)
            this.setValue(el.code ? el.code : el.name)
            e.preventDefault()
        }
    },
    onChange(e) {
        let value = e.target.value
        let el = this.props.items.filter(el => (el.code === value || el.name === value))[0]
        this.setState({
            trigger: el ? el.name : this.props.trigger
        })
        if (this.props.onChange) this.props.onChange(el)
        this.setValue(e.target.value)
    },
    componentDidUpdate(prevProps, prevState) {
        if (this.getValue() === '' && prevState.trigger !== this.props.trigger) {
            this.setState({
                trigger: this.props.trigger
            })
        }
        this.initHover()
    },
    initHover() {
        let el = findDOMNode(this.refs.block)
        hoverintent(el,
            () => {
                $(el).addClass('dropdown--hover')
            },
            () => {
                $(el).removeClass('dropdown--hover')
            }
        ).options({
            interval: 50
        })
    },
    componentDidMount() {

        this.initHover()
    },
    render() {
        let {items, title, name, trigger} = this.props
        const errorMessage = this.getErrorMessage()
        return <div className='form-group'>
                {title ? <label htmlFor={name}>{title}</label> : null}
                <div className={`dropdown ${this.showError() && !this.isPristine() ? 'dropdown--error' : ''} ${this.props.className ? this.props.className : ''}`} ref='block'>
                <a href='#' className='dropdown__trigger' onClick={e => (e.preventDefault())}>
                    {this.state.trigger ? this.state.trigger : items ? items[0].name : null} <img src='/layout/images/svg/down.svg' alt='' />
                </a>
                <span className='dropdown__frame'>
                    {items.map((el, i) => {
                        if ((el.code && el.code !== this.getValue()) || (!el.code && el.name !== this.getValue())) {
                            return <a key={i} onClick={this.onClick(i).bind(this)} href='#' className='dropdown__item'>{el.name}</a>
                        }
                        return null
                    })}
                </span>
                <select name={name} className='dropdown__select' value={this.getValue()} onChange={this.onChange}>
                    {trigger ? <option value=''>{trigger}</option> : null }
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

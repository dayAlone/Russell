import React from 'react'
import { Mixin } from 'formsy-react'
const RadioGroup = React.createClass({

    mixins: [Mixin],
    getInitialState() {
        return {active: false, trigger: this.props.trigger}
    },
    onChange(e) {
        let value = e.target.value
        this.setValue(e.target.value)
    },
    onClick(val) {
        return (e) => {
            this.setValue(val)
            e.preventDefault()
        }
    },
    render() {
        let {items, title, name, trigger} = this.props
        const errorMessage = this.getErrorMessage()
        return <div className='form-group radio-group'>
                {title ? <label htmlFor={name}>{title}</label> : null}
                {items.map((el, i) => {
                    let current = el.code ? el.code : el.name
                    return <span key={i}>
                        <input
                            onChange={this.onChange}
                            type='checkbox'
                            name={name}
                            value={current}
                            checked={current == this.getValue()} />
                        <a key={i} href='#' onClick={this.onClick(current)}>{el.name}</a>
                    </span>
                })}
            {errorMessage ? <span className='validation-error'>{errorMessage}</span> : null}
        </div>
    }
})

export default RadioGroup

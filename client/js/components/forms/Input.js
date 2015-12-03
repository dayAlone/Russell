import React from 'react'
import { Mixin } from 'formsy-react'

const MyInput = React.createClass({

    mixins: [Mixin],

    changeValue(event) {
        let value = event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']
        if (this.props.onChange) this.props.onChange(value)
        this.setValue(value)
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.getValue()) this.setValue(this.props.value)
    },
    render() {
        let { type, name, title, placeholder, className, maxLength, classFrame } = this.props
        const classNames = (className ? className : '') + ' ' + (this.showError() && !this.isPristine() ? 'error' : '')
        const errorMessage = this.getErrorMessage()

        return <div className={`form-group  ${classFrame ? classFrame : ''}`}>
            {title ? <label htmlFor={name}>{title}</label> : null}

            <input
                type={type || 'text'}
                name={name}
                onChange={this.changeValue}
                value={this.getValue()}
                className={classNames}
                maxLength={maxLength}
                placeholder={placeholder}
                checked={(type === 'radio' || type === 'checkbox') && this.getValue() ? 'checked' : null}
                />
            {errorMessage ? <span className='validation-error'>{errorMessage}</span> : null}
        </div>
    }
})

export default MyInput

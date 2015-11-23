import React from 'react'
import Formsy from 'formsy-react'
import { findDOMNode } from 'react-dom'
let File = React.createClass({

    mixins: [Formsy.Mixin],

    getInitialState() {
        return {
            filename: false
        }
    },

    changeValue(event) {
        let target = event.currentTarget
        let value = target.value
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files
        this.setState({filename: value.replace('C:\\fakepath\\', '')})
        this.setValue(value)
    },
    getFiles() {
        return this.refs.input.files[0]
    },
    handleClick(e) {
        $(findDOMNode(this.refs.input)).trigger('click')
        e.preventDefault()
    },
    render: function() {
        let { name } = this.props
        return <div className={`file ${this.showError() && !this.isPristine() ? 'error' : ''}`}>
            <a href='#' onClick={this.handleClick} className='file__trigger'>{this.props.title}</a>
            {this.state.filename && !this.props.noName ? <span className='file__info'>{this.state.filename}</span> : null}
            <input
                    ref='input'
                    type='file'
                    label={null}
                    onChange={this.changeValue}
                    name={name}
                    value={this.getValue()}
                    disabled={this.isFormDisabled() || this.props.disabled}
                    accept = {this.props.accept}
                />
        </div>
    }
})

export default File

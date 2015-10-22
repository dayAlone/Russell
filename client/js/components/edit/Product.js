import React, { Component } from 'react'
import t from 'tcomb-form'
const Form = t.form.Form

import { connect } from 'react-redux'
import * as actionCreators from '../../actions/catalog'
import { bindActionCreators } from 'redux'

let Product = t.struct({
    name: t.String,
    code: t.String,
    preview: t.String,
    images: t.list(t.String),
    description: t.String,
    short_description: t.String,
})

let formLayout = (locals) => {
    return <div className='row'>
        <div className='col-md-6'>
            {locals.inputs.name}
        </div>
        <div className='col-md-6'>
            {locals.inputs.code}
        </div>
        <div className='col-md-6'>
            {locals.inputs.description}
        </div>
        <div className='col-md-6'>
            {locals.inputs.short_description}
        </div>
    </div>
}

@connect(state => ({ products: state.catalog.products, collections: state.catalog.collections, categories: state.catalog.categories, isEditor: state.login.isEditor }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class EditProduct extends Component {
    save() {
        var value = this.refs.form.getValue()
        if (value) {
            console.log(value)
        }
    }
    render() {
        let options = {
            template: formLayout,
            fields: {
                name: {
                    label: 'Название'
                },
                code: {
                    label: 'Код'
                },
                preview: {
                    label: 'Превью'
                },
                images: {
                    label: 'Фотографии'
                },
                description: {
                    label: 'Полное описание',
                    type: 'textarea'
                },
                short_description: {
                    label: 'Кратное описание',
                    type: 'textarea'
                }
            },
            i18n: {
                add: 'Добавить',
                down: '▼',
                up: '▲',
                remove: '×',
                optional: '',
                required: ''
            }
        }
        return <div>
            <Form
                ref='form'
                type={Product}
                value={this.props.value}
                options={options}
                />
            <div className='row'>
                <button onClick={this.save.bind(this)} className='save'>Сохранить</button>
            </div>
        </div>
    }
}

export default EditProduct

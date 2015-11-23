import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../ui/Spinner'

import { Link } from 'react-router'
import * as loginActionCreators from '../../actions/login'
import * as catalogActionCreators from '../../actions/catalog'

import { bindActionCreators } from 'redux'

import Cropper from 'react-cropper'

import Formsy from 'formsy-react'
import { Input, File } from '../forms/'
Formsy.addValidationRule('minLengthOrEmpty', (values, value, length) => {
    return value && value.length >= length
})

@connect(state => ({ categories: state.catalog.categories, products: state.catalog.products }), dispatch => ({actions: bindActionCreators(catalogActionCreators, dispatch)}))
class Step1 extends Component {
    state = {
        data: false,
        active: false,
    }
    componentWillMount() {
        const { getProducts, getCategories } = this.props.actions
        let { products, categories } = this.props

        if (products.length === 0) getProducts()
        if (categories.length === 0) getCategories()
        this.makeDate()
    }
    componentDidUpdate() {
        this.makeDate()
    }
    makeDate() {
        let { data } = this.state
        let { products, categories } = this.props
        if (!data && products.length > 0 && categories.length > 0) {
            data = {}
            categories.map(el => (data[el._id] = {
                name: el.name,
                items: []
            }))
            products.map(el => (data[el.categories].items.push(el)))
            this.setState({data: data, active: Object.keys(data)[0]})
        }

    }
    makeActive(id) {
        return (e) => {
            this.setState({
                active: id
            })
            e.preventDefault()
        }
    }
    setProduct(id) {
        return (e) => {
            let status = this.props.getStateValue('status')
            status[0] = true
            this.props.setStateValue({
                product: id,
                status: status
            })
            e.preventDefault()
        }
    }
    render() {
        let { products, categories } = this.props
        let { data, active } = this.state
        let product = this.props.getStateValue('product')
        if (!data || products.length === 0 || categories.length === 0) return <Spinner/>
        let items = []
        for (let i in data) {
            let products = []
            if (i === active) data[i].items.map((el, i) => {
                let {_id, preview, name, artnumber} = el
                products.push(<div onClick={this.setProduct(_id)} className={`present__product products__item ${product === _id ? 'products__item--active':''}`} key={i}>
                    <div className='products__link'>
                        <div className='products__image'>
                            <img src={preview} alt={name} />
                        </div>
                        <div className={`products__name`}>{name}</div>
                        <div className='products__artnumber'>{artnumber}</div>
                    </div>
                </div>)
            })
            items.push(<div key={i} className={`present__category-frame ${i === active ? 'present__category-frame--active': ''}`}>
                <a href='#' onClick={this.makeActive(i)} className='present__category-name'>{data[i].name}</a>
                {i === active ? <div className='products products--ready'>{products}</div> : null}
            </div>)
        }
        return <div><p className='center'>Выбери технику из каталога, которую хочешь получить в подарок.</p>{items}</div>
    }
}

class Step2 extends Component {
    state = {
        file: null,
        image: false,
        cropper: false
    }
    addFile() {
        let reader = new FileReader();
        reader.onload = () => {

            this.setState({file: reader.result});
        }
        reader.readAsDataURL(this.refs.file.getFiles())
    }
    _crop() {
        let status = this.props.getStateValue('status')
        status[1] = true
        let fields = {
            image: this.refs.cropper.getCroppedCanvas().toDataURL(),
            cropper: this.refs.cropper.getData(),
            file: this.state.file,
            status: status
        }
        this.props.setStateValue(fields)
        this.setState(fields)
    }
    componentWillMount() {
        let image = this.props.getStateValue('image')
        let cropper = this.props.getStateValue('cropper')
        let file = this.props.getStateValue('file')
        if (cropper && image) {
            this.setState({
                image: image,
                cropper: cropper,
                file: file
            })
        }
    }
    render() {
        let {file, image} = this.state
        return <div className='center'>
                    <p>Загрузи свою фотографию, которую увидит получатель твоего письма.</p>
                    <Formsy.Form className='form' onValid={this.addFile.bind(this)}>
                        <File name='photo' noName={true} ref='file' title='Выбрать фото' validations='minLengthOrEmpty:1' value='' accept='image/jpeg,image/png,image/gif'/>
                    </Formsy.Form>

                    <div style={{display: file ? 'block' : 'none'}}>
                        <small>Для перемещения фотографии используй мышь или передвигай пальцем на touch-устройствах. Для масштабирования используй скролл мыши, жесты масштабирования или кнопки управления. Для поворота - кнопки управления.</small>
                        <Cropper
                        className='crop'
                        ref='cropper'
                        src={file}
                        data={this.state.cropper}
                        style={{height: 600, width: 600}}
                        aspectRatio={1 / 1}
                        guides={false}
                        crop={this._crop.bind(this)} />
                    </div>
                </div>
    }
}

@connect(state => ({user: state.login.data}))
class Step3 extends Component {
    state = { fields: false }
    componentWillMount() {
        let fields = this.props.getStateValue('fields')
        this.setState({
            fields: fields
        })
    }
    enableNext() {
        let fields = this.refs.form.getCurrentValues()
        let status = this.props.getStateValue('status')
        status[2] = true
        this.props.setStateValue({
            fields: fields,
            status: status
        })
        this.setState({
            fields: fields
        })
    }
    render() {
        if (this.state.fields) {
            let { from, email, to} = this.state.fields
            return <Formsy.Form className='form' onValid={this.enableNext.bind(this)}>
                <p className='center'>Укажи электронный адрес и имя того человека кому нам нужно намекнуть о подарке, который ты хочешь получить.</p>
                <Input value={this.props.user ? this.props.user.displayName : from} name='from' validations='minLengthOrEmpty:1' title='Имя отправителя'/>
                <Input value={email} name='email' validations='isEmail,minLengthOrEmpty:1' type='email' title='Контакты получателя' placeholder='Электронная почта получателя'/>
                <Input value={to} name='to' validations='minLengthOrEmpty:1' placeholder='Имя получателя'/>
            </Formsy.Form>
        }
        return <Spinner/>
    }
}

class Step4 extends Component {
    render() {
        return <div/>
    }
}

class Step5 extends Component {
    render() {
        return <div/>
    }
}

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(loginActionCreators, dispatch)}))
class Present extends Component {
    state = {
        step: 1,
        max: 5,
        titles: [
            'Выбери подарок',
            'Загрузи фотографию',
            'Укажи получателя',
            'Отправь письмо',
            'Письмо на модерации'
        ],
        components: [
            Step1,
            Step2,
            Step3,
            Step4,
            Step5
        ],
        status: [
            false,
            false,
            false,
            false,
            false
        ],
        fields : {
            from: null,
            email: null,
            to: null
        },
        product: false
    }
    getStateValue(id) {
        return this.state[id]
    }
    setStateValue(value) {
        this.setState(value)
    }
    goNext(e) {
        this.setState({
            step: this.state.step + 1
        })
        e.preventDefault()
    }
    goBack(e) {
        this.setState({
            step: this.state.step - 1
        })
        e.preventDefault()
    }
    render() {
        let { step, titles, max, status, components } = this.state
        let steps = []
        for (let i = 0; i < max - 1; i++) {
            steps.push(<span key={i} className={`present__step ${i === step ? 'present__step--active' : ''}`}>{i + 1}</span>)
        }
        let Component = components[step]
        return <div className='present present--bg'>
                <h2 className='center'>В подарок. Для себя</h2>
                <div className='present__toolbar'>
                    <div className='present__col'>
                        {steps}
                    </div>
                    <div className='present__col center'>
                        <h4>{titles[step]}</h4>
                    </div>
                    <div className='present__col right'>
                        {step > 0 ? <a href='#' className='button button--small' onClick={this.goBack.bind(this)}>Назад</a> : false }
                        {status[step] ? <a href='#' className='button button--small' onClick={this.goNext.bind(this)}>Далее</a> : false }
                    </div>
                </div>
                <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                <div className='present__content'>
                <Component getStateValue={this.getStateValue.bind(this)} setStateValue={this.setStateValue.bind(this)}/>
                </div>
                <div className='center'>
                    {status[step] ? <a href='#' onClick={this.goNext.bind(this)} className='button button--next button--small'>Следующий шаг</a> : false }
                </div>
            </div>
    }
}
export default Present

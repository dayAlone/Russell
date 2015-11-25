import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../ui/Spinner'

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
            if (i === active) {
                data[i].items.map((el, i) => {
                    let {_id, preview, name, artnumber} = el
                    products.push(<div onClick={this.setProduct(_id)} className={`present__product products__item ${product === _id ? 'products__item--active' : ''}`} key={i}>
                        <div className='products__link'>
                            <div className='products__image'>
                                <img src={preview} alt={name} />
                            </div>
                            <div className={`products__name`}>{name}</div>
                            <div className='products__artnumber'>{artnumber}</div>
                        </div>
                    </div>)
                })
            }
            items.push(<div key={i} className={`present__category-frame ${i === active ? 'present__category-frame--active' : ''}`}>
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
        let reader = new FileReader()
        reader.onload = () => {
            this.setState({file: reader.result})
        }
        reader.readAsDataURL(this.refs.file.getFiles())
    }
    componentWillUnmount() {
        this.setState({
            file: null,
            image: false,
            cropper: false
        })
    }
    _crop() {
        setTimeout(()=> {
            let status = this.props.getStateValue('status')
            status[1] = true
            let fields = {
                image: this.refs.cropper.getCroppedCanvas({width: 800, height: 800}).toDataURL(),
                cropper: this.refs.cropper.getData(),
                file: this.state.file,
                status: status
            }
            this.props.setStateValue(fields)
            this.setState(fields)
        }, 300)

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
    zoomIn(e) {
        this.refs.cropper.zoom(0.1)
        e.preventDefault()
    }
    zoomOut(e) {
        this.refs.cropper.zoom(-0.1)
        e.preventDefault()
    }
    rotateRight(e) {
        this.refs.cropper.rotate(10)
        e.preventDefault()
    }
    rotateLeft(e) {
        this.refs.cropper.rotate(-10)
        e.preventDefault()
    }
    render() {
        let { file } = this.state
        return <div className='center'>
                    <p>Загрузи свою фотографию, которую увидит получатель твоего письма.</p>
                    <Formsy.Form className='form' onValid={this.addFile.bind(this)}>
                        <File name='photo' noName={true} ref='file' title='Выбрать фото' validations='minLengthOrEmpty:1' value='' accept='image/jpeg,image/png,image/gif'/>
                    </Formsy.Form>

                    <div style={{display: file ? 'block' : 'none'}}>
                        <small>Для перемещения фотографии используй мышь или передвигай пальцем на touch-устройствах. Для масштабирования используй скролл мыши, жесты масштабирования или кнопки управления. Для поворота - кнопки управления.</small>
                        <div className='crop'>
                            <Cropper
                                ref='cropper'
                                src={file}
                                data={this.state.cropper}
                                style={{minHeight: 600}}
                                aspectRatio={1 / 1}
                                guides={false}
                                minCropBoxHeight={200}
                                minCropBoxWidth={200}
                                autoCropArea={1}
                                crop={this._crop.bind(this)} />
                            <div className='crop__buttons'>
                                <a href='#' onClick={this.zoomIn.bind(this)}><img src='/layout/images/svg/zoom-in.svg' alt='' /></a><br/>
                                <a href='#' onClick={this.zoomOut.bind(this)}><img src='/layout/images/svg/zoom-out.svg' alt='' /></a><br/>
                                <a href='#' onClick={this.rotateRight.bind(this)}><img src='/layout/images/svg/rotate1.svg' alt='' /></a><br/>
                                <a href='#' onClick={this.rotateLeft.bind(this)}><img src='/layout/images/svg/rotate2.svg' alt='' /></a>
                            </div>
                        </div>
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
            return <Formsy.Form className='form' ref='form' onValid={this.enableNext.bind(this)}>
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
    state = { locked: false }
    componentWillMount() {
        let image = this.props.getStateValue('image')
        let fields = this.props.getStateValue('fields')
        let product = this.props.getStateValue('product')
        this.setState({
            image: image,
            fields: fields,
            product: product
        })
    }
    dataURItoBlob(dataURI) {
        let byteString = atob(dataURI.split(',')[1])
        let ab = new ArrayBuffer(byteString.length)
        let ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: 'image/jpeg' })
    }
    sendPresent(e) {
        this.setState({ locked: true })
        let { image, fields, product } = this.state
        let { to, from, email } = fields
        let formData = new FormData()

        formData.append('image', this.dataURItoBlob(image))
        formData.append('product', product)
        formData.append('to', to)
        formData.append('from', from)
        formData.append('email', email)

        $.ajax({
            type: 'POST',
            url: '/profile/presents/add/',
            processData: false,
            cache: false,
            contentType: false,
            data: formData
        }).done(data => {
            this.setState({ locked: false })
            if (!data.error) {
                let status = this.props.getStateValue('status')
                status[3] = true
                this.props.setStateValue({ status: status, step: 4 })
            }
        })
        e.preventDefault()
    }
    render() {
        let {image, fields, product, locked} = this.state
        let {from, to} = fields
        return <div>
            <div className='center'>
                <p>Теперь посмотри, что получилось и отправь письмо</p>
            </div>
            <div className='present__letter'>
                <img src='/layout/images/mail-header.jpg' alt='' width='100%'/>
                <img src={image} alt='' width='100%'/>
                <div className='present__letter-col'>
                    Привет, {to}!<br/><br/>
                    Выбирать подарок – это не просто.<br/>Но что не сделаешь ради друга! Хочу облегчить для тебя этот процесс.<br/>
                    Намек – на фото.<br/><br/>
                    Мы с моей кухней будем счастливы получить это в подарок :)<br/><br/>
                    Заранее спасибо,<br/>
                    {from}<br/><br/>
                </div>
                <div className='present__letter-col center'>
                    <img src={`/layout/images/products/${product}.jpg`} width='100%' alt='' />
                </div>
                <img src='/layout/images/mail-line.jpg' alt='' width='100%'/>
                <div className='center present__letter-social'>
                    <img src='/layout/images/mail-fb.jpg' alt='' />
                    <img src='/layout/images/mail-vk.jpg' alt='' />
                    <img src='/layout/images/mail-inst.jpg' alt='' />
                </div>
                <img src='/layout/images/mail-footer.jpg' alt='' width='100%'/>
                <div className='present__letter-footer center'>©2015 SPECTRUM BRANDS , INC., ALL RIGHTS RESERVED</div>
            </div>
            <div className='center'>
                <a href='#' onClick={this.sendPresent.bind(this)} className={`button button--send ${locked ? 'button--locked' : ''}`}>
                    {locked ? <img src='/layout/images/loading.gif' alt='' /> : null} Отправить
                </a><br/>
                <small>Отправляя данное письмо, я подтверждаю, что действия выполняются лично мной и все возможные претензии, полученные в адрес Организатора, за нежелательную рассылку будут урегулированы мной с получателем данного письма. </small>

            </div>
        </div>
    }
}

class Step5 extends Component {
    render() {
        return <div className='center'>
            <p>Как только мы убедимся в том, что загруженная вами фотографии отвечает<br/> нашим требованиям, мы сразу же отправим письмо вашему другу.<br/>Информация об этом будет доступна в вашем Личном кабинете</p>
            <a href='#' className='button button--again' onClick={this.props.makeNew}>Отправить еще одно письмо?</a>

        </div>
    }
}

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(loginActionCreators, dispatch)}))
class Present extends Component {
    state = {}
    initialState = {
        step: 0,
        max: 4,
        titles: [
            'Выберите подарок',
            'Загрузите фотографию',
            'Укажите получателя',
            'Отправьте письмо',
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
        fields: {
            from: null,
            email: null,
            to: null
        },
        product: false,
        file: null,
        image: false,
        cropper: false
    }
    componentWillMount() {
        let copy = Object.assign({}, this.initialState)
        this.setState(copy)
    }
    makeNew(e) {
        let copy = Object.assign({}, this.initialState)
        copy.status = [
            false,
            false,
            false,
            false,
            false
        ]
        this.setState(copy)
        e.preventDefault()
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
        for (let i = 0; i < max; i++) {
            steps.push(<span key={i} className={`present__step ${i === step ? 'present__step--active' : ''}`}>{i + 1}</span>)
        }
        let Element = components[step]
        return <div className='present present--bg'>
                <h2 className='center'>В подарок. Для себя</h2>
                <div className='present__toolbar'>
                    <div className='present__col'>
                        {steps}
                    </div>
                    <div className='present__col center'>
                        <h4>{titles[step]}</h4>
                    </div>
                    {step !== max ? <div className='present__col right'>
                        {step > 0 ? <a href='#' className='button button--small' onClick={this.goBack.bind(this)}>Назад</a> : false }
                        {status[step] ? <a href='#' className='button button--small' onClick={this.goNext.bind(this)}>Далее</a> : false }
                    </div> : null }
                </div>
                <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                <div className='present__content'>
                <Element makeNew={this.makeNew.bind(this)} getStateValue={this.getStateValue.bind(this)} setStateValue={this.setStateValue.bind(this)}/>
                </div>
                <div className='center'>
                    {status[step] ? <a href='#' onClick={this.goNext.bind(this)} className='button button--next button--small'>Следующий шаг</a> : false }
                </div>
            </div>
    }
}
export default Present

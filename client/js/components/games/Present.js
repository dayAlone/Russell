import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from '../ui/Spinner'

import { Link } from 'react-router'
import * as loginActionCreators from '../../actions/login'
import * as catalogActionCreators from '../../actions/catalog'

import { bindActionCreators } from 'redux'


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
            console.log(data)
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
            Step2
        ],
        status: [
            false,
            false,
            false,
            false,
            false
        ],
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

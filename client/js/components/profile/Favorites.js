import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'

import moment from 'moment'

class Favorite extends Component {
    render() {
        let { until, _id } = this.props.check
        let { added, product } = this.props.data
        let { code, preview, name, artnumber } = product
        return <div className='favorite table__row'>
            <div className='table__col left'>
                <a href={`/catalog/product/${code}`} target='_blank' className='favorite__name'>
                    <img src={preview} className='favorite__image'/>{name}<br/>{artnumber}
                </a>
            </div>
            <div className='table__col' dangerouslySetInnerHTML={{__html: moment(added).format('DD.MM.YYYY<br/>HH:mm')}} />
            <div className='table__col'>ID: {_id}</div>
            <div className='table__col'>{moment(until).format('DD.MM.YYYY')}</div>
            <div className='table__col right'><a href='#' onClick={this.props.handleRemove} className='favorite__delete'>Удалить и отвязать от&nbsp;чека</a></div>
        </div>
    }
}

@connect(state => ({checks: state.profile.checks}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileFavorites extends Component {
    componentDidMount() {
        if (this.props.checks.length === 0) {
            this.props.actions.getChecks()
        }
    }
    handleRemove(check, product) {
        return (e) => {
            this.props.actions.removeProduct(check, product)
            e.preventDefault()
        }
    }
    render() {
        let favorites = []
        this.props.checks.map((el, i) => {
            if (moment(el.until) > moment()) {
                el.products.map((p, key) => {
                    favorites.push(<Favorite handleRemove={this.handleRemove(el._id, p._id)} data={p} key={i + '_' + key} check={el}/>)
                })
            }
        })
        return <div className='favorites'>
            <Helmet title='Russell Hobbs | Личный кабинет | Избранное'/>
            <div className='table favorites__table'>
                <div className='table__title'>
                    <div className='table__col left'>Выбранный товар</div>
                    <div className='table__col'>Дата добавления</div>
                    <div className='table__col'>Привязан к чеку</div>
                    <div className='table__col'>Дата розыгрыша</div>
                    <div className='table__col'></div>
                </div>
                {favorites.length > 0 ?
                    favorites
                    :
                    <div className='table__row table__row--message center'>
                        У вас нет ни одного товара в избранном.<br/><Link to='/catalog/'>Выбрать товары из каталога</Link>
                    </div>}
            </div>

        </div>
    }
}

export default ProfileFavorites

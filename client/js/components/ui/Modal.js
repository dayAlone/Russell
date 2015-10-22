import React, { Component } from 'react'
//import Children from 'react-addons-children'
import ScaleModal from 'boron/ScaleModal'
class Modal extends Component {
    handleOnHide() {
        $('body')
            .removeClass('modal-open')
            .css('padding-right', 0)
            .removeClass('modal-overflow')
        return false
    }
    handleOnShow() {
        $('body').addClass('modal-open')

        this.checkOwerflow()
        $(window).on('resize', () => {
            this.checkOwerflow()
        })
    }

    measureScrollbar() {
        let scrollDiv = document.createElement('div')
        $('body').append(scrollDiv)

        $(scrollDiv).css({ position: 'absolute', top: '-9999px', width: '50px', height: '50px', overflow: 'scroll' })
        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        $(scrollDiv).remove()

        return scrollbarWidth
    }
    checkOwerflow() {
        setTimeout(() => {
            const scrollbarWidth = this.measureScrollbar()
            const bodyPadding = parseInt(($('body').css('padding-right') || 0), 10)
            const isOverflow = $('.modal__content').height() > $('.modal-frame').height()
            if (isOverflow) {
                $('body')
                    .css('padding-right', bodyPadding + scrollbarWidth)
                    .addClass('modal-overflow')
            } else {
                $('body')
                    .css('padding-right', 0)
                    .removeClass('modal-overflow')
            }
        }, 500)
    }

    show() {
        this.refs.modal.enter()
        this.refs.modal.show()
    }
    hide() {
        this.refs.modal.hide()
    }
    componentWillUnmount() {
        this.handleOnHide()
    }
    renderChildren() {
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                hideModal: this.hide,
                hello: 123
            })
        })
    }
    render() {
        return <div className={`modal-frame ${this.props.static ? 'modal-frame--static' : ''}`}>
            <ScaleModal {...this.props}
                className={'modal ' + this.props.className}
                ref='modal'
                onHide={this.handleOnHide.bind(this)}
                onShow={this.handleOnShow.bind(this)}/>
        </div>
    }
}

export default Modal

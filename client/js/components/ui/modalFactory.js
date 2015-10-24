import React from 'react'
import transitionEvents from 'react-kit/transitionEvents'
import RenderInBody from './RenderInBody'

export default function(animation) {

    return React.createClass({
        propTypes: {
            className: React.PropTypes.string,
            // Close the modal when esc is pressed? Defaults to true.
            keyboard: React.PropTypes.bool,
            onShow: React.PropTypes.func,
            onHide: React.PropTypes.func,
            animation: React.PropTypes.object,
            backdrop: React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.string
            ])
        },

        getDefaultProps() {
            return {
                className: '',
                onShow: function() {},
                onHide: function() {},
                animation: animation,
                keyboard: true,
                backdrop: true
            }
        },

        getInitialState() {
            return {
                willHidden: false,
                hidden: true
            }
        },

        hasHidden() {
            return this.state.hidden
        },

        measureScrollbar() {
            let scrollDiv = document.createElement('div')
            $('body').append(scrollDiv)

            $(scrollDiv).css({ position: 'absolute', top: '-9999px', width: '50px', height: '50px', overflow: 'scroll' })
            let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
            $(scrollDiv).remove()

            return scrollbarWidth
        },

        componentDidMount() {
            /*
            let ref = this.props.animation.getRef()
            let node = this.refs[ref].getDOMNode()
            let endListener = function(e) {
                if (e && e.target !== node) {
                    return
                }
                transitionEvents.removeEndEventListener(node, endListener)
                this.enter()

            }.bind(this)
            transitionEvents.addEndEventListener(node, endListener)
            */
            window.addEventListener('keydown', this.listenKeyboard, true)
        },

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
        },

        render() {

            let hidden = this.hasHidden()
            if (hidden) return null

            let willHidden = this.state.willHidden
            let animation = this.props.animation
            let modalStyle = animation.getModalStyle(willHidden)
            let backdropStyle = animation.getBackdropStyle(willHidden)
            let contentStyle = animation.getContentStyle(willHidden)
            let ref = animation.getRef(willHidden)
            let sharp = animation.getSharp && animation.getSharp(willHidden)
            let backdrop = this.props.backdrop ? <div onClick={this.hide} style={backdropStyle} className='modal-backdrop'/> : undefined

            if (willHidden) {
                let node = this.refs[ref]
                let endListener = function(e) {
                    if (e && e.target !== node) {
                        return
                    }

                    transitionEvents.removeEndEventListener(node, endListener)
                    this.leave()

                }.bind(this)
                transitionEvents.addEndEventListener(node, endListener)
            }

            return <span className={`modal-frame ${this.props.static ? 'modal-frame--static' : ''}`}>
                    <div ref='modal' style={modalStyle} className={this.props.className}>
                        {sharp}
                        <div ref='content' tabIndex='-1' style={contentStyle} className='modal__content'>
                            {this.props.children}
                        </div>
                    </div>

                    {backdrop}
                </span>

        },

        leave: function() {
            this.setState({
                hidden: true
            })
            this.props.onHide()
        },

        enter: function() {
            this.props.onShow()
        },

        show: function() {
            if (!this.hasHidden()) return
            setTimeout(() => {
                $('body').addClass('modal-open')
            }, 250)


            this.checkOwerflow()
            $(window).on('resize', () => {
                this.checkOwerflow()
            })

            this.setState({
                willHidden: false,
                hidden: false
            })
        },

        hide: function() {
            if (this.hasHidden()) return

            $('body')
                .removeClass('modal-open')
                .css('padding-right', 0)
                .removeClass('modal-overflow')

            this.setState({
                willHidden: true
            })
        },

        toggle: function() {
            if (this.hasHidden()) {
                this.show()
            } else {
                this.hide()
            }
        },

        listenKeyboard: function(event) {
            if (this.props.keyboard &&
                    (event.key === 'Escape' ||
                     event.keyCode === 27)) {
                this.hide()
            }
        },

        componentWillUnmount: function() {
            window.removeEventListener('keydown', this.listenKeyboard, true)
        },

    })

}

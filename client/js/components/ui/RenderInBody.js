import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'

@connect()
class RenderInBody extends Component {
    static contextTypes = {
        store: React.PropTypes.object
    }
    constructor(props, context) {
        super(props)
        super(context)
    }
    componentDidMount() {

        this._container = document.createElement('div')
        document.body.appendChild(this._container)
        this._child = ReactDOM.render(this.props.children, this._container)
    }

    componentDidUpdate() {
        if (!this._child) return
        this._child.setState({})
    }

    componentWillUnmount() {
        React.unmountComponentAtNode(this._container)
        document.body.removeChild(this._container)
    }

    _renderLayer() {

        ReactDOM.render(this.props.children, this.popup)
    }

    render() {
        // Render a placeholder
        return null
    }

}
export default RenderInBody

import React, { Component } from 'react'
class RenderInBody extends Component {
    componentDidMount() {
        this.popup = document.createElement('div')
        document.body.appendChild(this.popup)
        this._renderLayer()
    }

    componentDidUpdate() {
        this._renderLayer()
    }

    componentWillUnmount() {
        React.unmountComponentAtNode(this.popup)
        document.body.removeChild(this.popup)
    }

    _renderLayer() {
        React.render(this.props.children, this.popup)
    }

    render() {
        // Render a placeholder
        return false
    }

}
export default RenderInBody

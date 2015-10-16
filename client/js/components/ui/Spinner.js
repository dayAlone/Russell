import React, { Component } from 'react';
import Spinner from 'spin.js';

class ReactSpinner extends Component {
    static defaultProps = {
        style: {
            minHeight: 400,
            width: '100%',
            float: 'left',
            position: 'relative'
        },
        config: {
            lines: 13,
            length: 37,
            width: 2,
            radius: 40,
            scale: 1,
            corners: 1,
            color: 'white',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 0.8,
            trail: 70,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '50%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
    }}

    displayName = 'ReactSpinner'

    propTypes: {
        config: React.PropTypes.object,
        stopped: React.PropTypes.bool,
        style: React.PropTypes.object,
        spinner: React.PropTypes.object
    }

    componentDidMount() {
        this.spinner = new Spinner(this.props.config);
        this.spinner.spin(this.refs.container);
    }

    componentWillReceiveProps(newProps) {

        if (this.props.stopped) {
            return;
        }

        if (newProps.stopped) {
            this.spinner.stop();
        } else {
            this.spinner.spin(this.refs.container);
        }
    }

    componentWillUnmount() {
        this.spinner.stop();
    }

    render() {
        return <div ref='container' style={this.props.style} />;
    }
};

module.exports = ReactSpinner;

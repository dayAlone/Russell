import React from 'react'
import insertKeyframesRule from 'react-kit/insertKeyframesRule'
import appendVendorPrefix from 'react-kit/appendVendorPrefix'
import modalFactory from './modalFactory'
var animation = {
    show: {
        animationDuration: '0.3s',
        animationTimingFunction: 'cubic-bezier(0.6,0,0.4,1)'
    },
    hide: {
        animationDuration: '0.3s',
        animationTimingFunction: 'ease-out'
    },
    showContentAnimation: insertKeyframesRule({
        '0%': {
            opacity: 0,
            transform: 'scale3d(0, 0, 1)'
        },
        '100%': {
            opacity: 1,
            transform: 'scale3d(1, 1, 1)'
        }
    }),

    hideContentAnimation: insertKeyframesRule({
        '0%': {
            opacity: 1
        },
        '100%': {
            opacity: 0,
            transform: 'scale3d(0.5, 0.5, 1)'
        }
    }),

    showBackdropAnimation: insertKeyframesRule({
        '0%': {
            opacity: 0
        },
        '100%': {
            opacity: 1
        },
    }),

    hideBackdropAnimation: insertKeyframesRule({
        '0%': {
            opacity: 1
        },
        '100%': {
            opacity: 0
        }
    })
}

let {
    show: showAnimation,
    hide: hideAnimation,
    showContentAnimation,
    hideContentAnimation,
    showBackdropAnimation,
    hideBackdropAnimation,
} = animation

export default modalFactory({
    getRef() {
        return 'content'
    },
    getModalStyle() {
        return appendVendorPrefix({
            zIndex: 1050,
            position: 'fixed',
            transform: 'translate3d(-50%, -50%, 0)',
            top: '50%',
            left: '50%'
        })
    },
    getBackdropStyle(willHidden) {
        return appendVendorPrefix({
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1040,
            animationFillMode: 'forwards',
            animationDuration: '0.4s',
            animationName: willHidden ? hideBackdropAnimation : showBackdropAnimation,
            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
        })
    },
    getContentStyle(willHidden) {
        return appendVendorPrefix({
            margin: 0,
            animationDuration: (willHidden ? hideAnimation : showAnimation).animationDuration,
            animationFillMode: 'forwards',
            animationName: willHidden ? hideContentAnimation : showContentAnimation,
            animationTimingFunction: (willHidden ? hideAnimation : showAnimation).animationTimingFunction
        })
    }
})

import React, { Component } from 'react'
import Slick from 'react-slick'

let customArrow = (arrowClass, img) => {
    return class extends Component {
        render() {
            return <button type='button' data-role='none' onClick={this.props.onClick} className={arrowClass}><img src={`/layout/images/${img}`} /></button>
        }
    }
}

class Carousel extends Component {
    static defaultProps = {
        imgNext: 'svg/next.svg',
        imgPrev: 'svg/prev.svg',
        arrowClass: false
    }
    render() {
        let { imgNext, imgPrev, arrowClass, arrowsType, slideToShow} = this.props
        if (arrowsType === 'black') {
            imgNext = 'next.png'
            imgPrev = 'prev.png'
            arrowClass = 'black'
        }
        let options = {
            accessibility: false,
            slidesToScroll: 1,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            adaptiveHeight: false,
            slidesToShow: slideToShow,
            prevArrow: customArrow(`slick-prev slick-arrow ${arrowClass}`, imgPrev),
            nextArrow: customArrow(`slick-next slick-arrow ${arrowClass}`, imgNext),
            responsive: this.props.responsive ? [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 620,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 400,
                    settings: {
                        slidesToShow: 1,
                        adaptiveHeight: true
                    }
                },
                {
                    breakpoint: 300,
                    settings: {
                        slidesToShow: 1
                    }
                },
            ] : false
        }
        return <div className={this.props.className}><Slick {...options}>
            {this.props.children}
        </Slick></div>
    }
}

export default Carousel

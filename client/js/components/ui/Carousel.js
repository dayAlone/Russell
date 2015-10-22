import React, { Component } from 'react'
import slick from 'slick-carousel'

class Carousel extends Component {
    static defaultProps = {
        imgNext: 'svg/next.svg',
        imgPrev: 'svg/prev.svg',
        arrowClass: false
    }
    initSlick() {
        const $el = $(this.refs.carousel)
        let { imgNext, imgPrev, arrowClass, arrowsType, slideToShow} = this.props
        if ($el.hasClass('slick-initialized')) $el.slick('unslick')

        if (arrowsType === 'black') {
            imgNext = 'next.png'
            imgPrev = 'prev.png'
            arrowClass = 'black'
        }
        setTimeout(()=>{
            $el.slick({
                accessibility: false,
                slidesToScroll: 1,
                infinite: true,
                //autoplay: true,
                adaptiveHeight: false,
                slidesToShow: slideToShow,
                nextArrow: `<button type='button' class='slick-next ${arrowClass}'><img src='/layout/images/${imgNext}' /></button>`,
                prevArrow: `<button type='button' class='slick-prev  ${arrowClass}'><img src='/layout/images/${imgPrev}' /></button>`,
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
            })
        }, 300)

    }
    componentDidMount() {
        this.initSlick()
    }
    componentDidUpdate() {
        this.initSlick()
    }
    render() {
        return <div ref='carousel' className={this.props.className}>
            {this.props.children}
        </div>
    }
}

export default Carousel

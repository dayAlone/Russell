import React, { Component } from 'react';
import slick from 'slick-carousel';

class Carousel extends Component {
    static defaultProps = {
        imgNext: 'svg/next.svg',
        imgPrev: 'svg/prev.svg',
        arrowClass: false
    }
    initSlick() {
        const $el = $(this.refs.carousel);
        let { imgNext, imgPrev, arrowClass, arrowsType, slideToShow} = this.props;
        if ($el.hasClass('slick-initialized')) $el.slick('unslick');

        if (arrowsType === 'black') {
            imgNext = 'next.png';
            imgPrev = 'prev.png';
            arrowClass = 'black';
        }
        $el.slick({
            accessibility: false,
            slidesToScroll: 1,
            infinite: true,
            slidesToShow: slideToShow,
            nextArrow: '<button type="button" class="slick-next '+ arrowClass +'"><img src="/layout/images/' + imgNext + '" /></button>',
            prevArrow: '<button type="button" class="slick-prev '+ arrowClass +'"><img src="/layout/images/' + imgPrev + '" /></button>'
        });


    }
    componentDidMount() {
        this.initSlick();
    }
    componentDidUpdate() {
        this.initSlick();
    }
    render() {
        return <div ref='carousel' className={this.props.className}>
            {this.props.children}
        </div>;
    }
}

export default Carousel;

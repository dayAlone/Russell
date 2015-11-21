import moment from 'moment'

export default (Prize) => {
    let prizes = [{
        name: '3-в-1 Сэндвичница-Вафельница-Гриль Fiesta 22570-56',
        photo: 'http://164623.selcdn.com/russell/upload/products/48d5d2012e331006376f528e.png'
    }, {
        name: 'Блендер для приготовления смузи с собой Explore Mix & Go 21350-56',
        photo: 'http://164623.selcdn.com/russell/upload/products/3174e38cf2f4713f7f7022af.png'
    }, {
        name: 'Коллекция Illumina',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/illumina.png'
    }, {
        name: 'Компактный гриль со съемными пластинами 20830-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/aa8c09fbbe5590fe86276b9c.png'
    }, {
        name: 'Кофеварка Futura 18663-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/18663-56_Futura_Coffee_Maker_CO.png'
    }, {
        name: 'Кофеварка Steel Touch 18503-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/2BaFh1dvJpI.png'
    }, {
        name: 'Кухонный комбайн Explore 19460-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/c7ee97b354ca4f5b10aa0c0f.png'
    }, {
        name: 'Овощерезка Desire 20346-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/prod_6915_20346_main.png'
    }, {
        name: 'Тостер Flame Red 18951-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/prod_5006_18951_main.png'
    }, {
        name: 'Универсальный гриль Fiesta с камнем для жарки 21000-56',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/fb4af634e4f3144a09492351.png'
    }, {
        name: 'Утюг Colour Control Iron 19840-56 ',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/prod_6112_19840-56_main_update.png'
    }, {
        name: 'Чайник Kitchen Collection 19630-70',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/prod_5016_19630_main.png'
    }, {
        name: 'Чайник Legacy Stainless Steel 21280-70',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/prod_7333_21280_main.png'
    }, {
        name: 'Чайник Precision Control 21150-70',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/prod_6668_21150_main.png'
    }, {
        name: 'Чайник Steel Touch 18501-70',
        photo: 'http://164623.selcdn.com/russell/layout/images/prizes/20026294b20.png'
    }]
    prizes.forEach(el => {
        Prize.create(el)
    })
}

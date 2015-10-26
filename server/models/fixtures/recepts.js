import oid from '../../libs/oid'
import config from 'config'
//import cheerio from 'cheerio'
import selectel from 'selectel-manager'
import fs from 'fs'
import co from 'co'

const uploadFile = (from, file) => {

    let path = config.__dirname + '/client/public/images/recepts/' + from
    selectel.uploadFile(
        path,
        '/russell' + file.path + file.name,
        (err) => {
            if (err) console.error(err)
            //fs.unlink(path)
        })
}

export default (Recept) => {
    let data = [
        {
            video: 'GxTaLVNa7u4',
            title: 'Трафареты для кофе',
            text: 'Сделайте свой утренний кофе особенным, с помощью какао-порошка и самодельных трафаретов.',
        },
        {
            video: 'ySUU29H_BIE',
            title: 'Пирог в форме сердца',
            text: 'Покажите свою любовь, приготовив пирог в форме сердца из квадратного коржа и двух половинок круглого.'
        },
        {
            video: 'l8fWfy9RBuI',
            title: 'Улыбающийся тост',
            text: 'Чтобы завтрак был веселым, нарисуйте водой смайлик на кусочке хлеба для тоста.'
        },
        {
            video: 'uDo7m2uDzlo',
            title: 'Идеальные яйца пашот',
            text: 'Яйца пашот будут всегда получаться идеально, если готовить их в мешочках из пищевой пленки. Чтобы сэкономить время, сначала вскипятите воду в чайнике.'
        },
        {
            video: '8pqu_lo1bzE',
            title: 'Легкий способ намазать холодное масло',
            text: 'Намажьте то, что не намазывается. Справиться с холодным маслом поможет терка.'
        },
        {
            title: 'Хочу добавки!',
            text: 'Добавляйте немного специй в любимую еду вашего ребенка, чтобы развивать его вкусовые ощущения.'
        },
        {
            video: 'XCCU1fFA8hc',
            title: 'Как сложить футболку за 2 секунды',
            text: 'Сложите футболку за считаные мгновения. Просто возьмите футболку пальцами в двух местах и встряхните ее.'
        },
        {
            video: 'kBuvqADeuZU',
            title: 'Слоеное удовольствие',
            text: 'Наливайте соусы в прозрачную чашу слоями – и наслаждайтесь необыкновенными сочетаниями вкусов.'
        },
        {
            title: 'Согревающий моктейл',
            text: 'Добавьте мед, корицу и мускатный орех в ваш любимый чай, и у вас получится согревающий зимний микс – моктейл.'
        },
        {
            title: 'Кофе с корицей и фундуком',
            text: 'Если в кофемолку при помоле зерен добавить корицу или фундук, кофе станет слаще на вкус.'
        },
        {
            title: 'Кубики замороженного кофе',
            text: 'Холодный кофе сохранит свой насыщенный вкус, если вместо обычного льда вы положите в него кубики замороженного кофе.'
        },
        {
            title: 'Выпечка с добавлением кофе',
            text: 'Отличный способ разнообразить вкус сладкой выпечки - добавьте немного кофе в печенье или брауни во время приготовления.'
        },
        {
            title: 'Начните день с романтики',
            text: 'Сделайте завтрак особенным – и вы наполните любовью весь день. '
        },
        {
            title: 'Тыквенный крем-суп на кокосовом молоке',
            text: 'Замените обычное молоко в крем-супе на кокосовое – и суп станет более нежным и кремовым.'
        },
        {
            title: 'Полезный торт',
            text: 'Когда вы готовите торт, замените сливочное масло на авокадо – так гораздо полезнее для здоровья'
        },
        {
            title: 'С чего начинается чизкейк',
            text: 'Чтобы основа чизкейка из песочной крошки была более плотной и ароматной, добавьте в нее теплую светлую патоку.'
        },
        {
            title: 'Джем из хлебопечки',
            text: 'Самый простой способ приготовить изысканный джем – положить все ингредиенты в хлебопечку.'
        },
        {
            title: 'Глинтвейн в медленноварке',
            text: 'Медленноварка может пригодиться вам на вечеринке. Включите ее в режиме низкой температуры и можете подавать в ней что угодно, даже глинтвейн.'
        },
        {
            title: 'Суп из остатков продуктов',
            text: 'Просто добавьте бульон к оставшимся продуктам, смешайте в блендере, пока все не превратится в пюре, и получится вкусный суп.'
        },
        {
            title: 'Панини с хрустящей корочкой',
            text: 'Чтобы ваши панини стали особенными, смажьте их оливковым маслом перед обжариванием – и у них появится хрустящая корочка.'
        },
        {
            title: 'Глажка с приятным ароматом',
            text: 'Чтобы у поглаженных вещей был приятный запах, добавьте каплю масла лаванды в пульверизатор с водой и сбрызните вещи перед глажкой.'
        },
        {
            title: 'Крутоны с изюминкой',
            text: 'Приготовьте крутоны с сыром на гриле и добавьте их в суп, чтобы придать ему изюминку. '
        },
        {
            title: 'Секрет приготовления прохладного смузи',
            text: 'Если измельчить замороженные ягоды в блендере, получится прохладный смузи.'
        },
        {
            title: 'Полезный фруктовый лед',
            text: 'Замороженный в формочках для мороженого яблочный и морковный сок станет полезным летним лакомством для детей.'
        },
        {
            title: 'Простой способ приготовления мидий',
            text: 'Чтобы легко определить, когда мидии откроются и будут готовы, нужно готовить их в пароварке.  '
        },
        {
            title: 'Вечеринка «Собери бургер сам»',
            text: 'Устройте вечеринку «Собери бургер сам», от которой все будут в восторге'
        },
        {
            title: 'Необычное фондю',
            text: 'Вкус вашего фондю станет более оригинальным, если вы натрете перед приготовлением кастрюльку для плавки сыра зубчиком чесноком.'
        },
        {
            title: 'Фигурные блинчики – это просто',
            text: 'Налейте тесто для блинчиков в бутылку из мягкого пластика, и вы без труда сможете делать вкусные и красивые фигурные блинчики'
        },
        {
            title: 'Давайте мясу отдохнуть',
            text: 'Если у вас нет решетки, чтобы довести до готовности только что пожаренные стейки, сложите их «домиком»'
        },
        {
            title: 'Фруктовые тосты',
            text: 'Кроме обычных горячих сендвичей, в бутерброднице можно приготовить сладкие тосты из бриоши с фруктами.'
        }]
    const files = fs.readdirSync(config.__dirname + '/client/public/images/recepts/')
        .filter(el=>(el.indexOf('.jpg') !== -1))
        .sort((a, b) => {
            return parseInt(b.match(/_00(\d{2})/)[1], 10) - parseInt(a.match(/_00(\d{2})/)[1], 10)
        })

    selectel.authorize(config.selectel.login, config.selectel.password, () => {
        let exist = {}
        let upload = {}
        co(function*() {
            let result = yield new Promise((fulfill, reject) => {
                selectel.getContainerFiles('russell', (err, data) => {
                    if (err) reject(err)
                    fulfill(data)
                }, { format: 'json', path: ['upload/recepts/'] })
            })
            JSON.parse(result.files).map(el => {
                exist['/' + el.name] = true
            })
            data.map((el, i) => {
                let image = {
                    name: `${oid(files[i])}.jpg`,
                    path: '/upload/recepts/'
                }
                upload[files[i]] = image
                let result = {
                    name: el.title,
                    preview: config.cdn + image.path + image.name,
                    description: el.text,
                    video: el.video ? el.video : null
                }
                Recept.create(result)
            })
            for (let i in upload) {
                let file = upload[i]
                if (!exist[file.path + file.name]) {
                    if (i) {
                        uploadFile(i, file)
                    }
                }
            }
        }).catch(err=>(console.error(err)))

    })
}

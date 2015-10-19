import React, { Component } from 'react';
import oid from '../../../../server/libs/oid';
import Helmet from 'react-helmet';

import Title from '../layout/Title';
import ShareLove from '../ShareLove';
import Categories from '../Categories';

class PageIndex extends Component {
    componentDidUpdate() {
        this.get();
    }
    componentDidMount() {
        this.get();
    }
    getCategories() {
        $.get('https://ru.russellhobbs.com/russell-hobbs-products/', (data) => {
            $(data).find('#dsnestCat li').each((key, el)=> {
                let $el = $(el);
                let $img = $el.find('img');

                if ($img) {
                    let result = {
                        name: $img.attr('alt'),
                        image: $img.attr('src'),
                        short_description: $el.find('p').text()
                    };
                    let url = $el.find('a').attr('href');
                    $.get(url, (data) => {
                        result.code = url.split('/').slice(-2, -1)[0];
                        result.description = $(data).find('.dsCATtxt').html();
                        result.line = data.match(/#dsContentMaskB"\).css\({'background-image':'url\((.*?)\)'}\);/)[1];
                        $.post('/catalog/category/add/', result);
                    });


                }
            });
        });
    }
    getCollections() {
        $.get('https://ru.russellhobbs.com/russell-hobbs-collections/', (data) => {
           $(data).find('#dsnestCat li').each((key, el)=> {
               let $el = $(el);
               let $img = $el.find('img');

               if ($img) {
                   let result = {
                       name: $img.attr('alt'),
                       image: $img.attr('src'),
                       short_description: $el.find('p').text()
                   };
                   $.get($el.find('a').attr('href'), (data) => {
                       result.description = $(data).find('.dsCATtxt').html();
                       result.line = data.match(/#dsContentMaskB"\).css\({'background-image':'url\((.*?)\)'}\);/)[1];
                       $.post('/catalog/collection/add/', result);
                   });

               }
           });
       });
    }
    getProducts() {
        let collections = ['legacy', 'colours', 'illumina', 'clarity-collection', 'fiesta', 'buckingham', 'aura', 'jewels', 'desire', 'black-glass', 'precision-control', 'cook-home', 'mode', 'explore', 'kitchen-collection'];
        let categories = ['toasters', 'steam-mops', 'coffee-machines', 'irons', 'kettles', 'cooking-and-baking', 'food-preparation'];
        let bad = 0;
        $.get('/layout/links.json', (data) => {

            data.forEach(url => {
                let category = false;
                let collection = false;
                categories.forEach(i => {
                    if (url.indexOf(i.substring(0, i.length - 1).split('-')[0]) !== -1) category = i;
                });

                collections.forEach(i => {
                    if (url.indexOf(i.substring(0, i.length - 1).split('-')[0]) !== -1) collection = i;
                });
                if (!category) {
                    if (collection === 'fiesta' || url.indexOf('grill') !== -1) category = 'cooking-and-baking';
                    if (collection === 'explore' || url.indexOf('blender') !== -1) category = 'food-preparation';
                    if (url.indexOf('coffee') !== -1) category = 'coffee-machines';
                }
                $.get(url, data => {
                    let nameRaw = $(data).find('.dsPROMain > img').attr('title').split(' ');

                    let result = {
                        name: nameRaw.slice(4, -2).join(' '),
                        artnumber: nameRaw.slice(-2, -1)[0],
                        preview: $(data).find('.dsPROMain > img').attr('src'),
                        images: [],
                        line: $(data).find('#dsPROstrip').css('background-image').replace(/\s?url\([\'\"]?/, '').replace(/[\'\"]?\)/, ''),
                        short_description: $(data).find('.dsPROtxt').html(),
                        description: $(data).find('#tab-features').html(),
                        category: oid(category),
                        collection: oid(collection)
                    };
                    $(data).find('#dsPROHvrInset img').each((i, el) => {
                        result.images.push($(el).attr('src'));
                    });
                    $.post('/catalog/product/add/', result);
                });
            });
        });
    }
    get() {
        //this.getProducts();
        //this.getCategories();
        //this.getCollections();
    }
    render() {
        return <div className='page page--index'>
            <Helmet title='Russell Hobbs' />
            <Title type='big' />
            <Categories type='carousel' source='collections'>
                <div className='text'>
                    <h2>В cердце вашего дома</h2>
                    <p>Первая чашка кофе утром, тепло свежевыглаженной рубашки, улыбка удовольствия от аромата свежей выпечки – вот те моменты, которые действительно имеют значение, моменты истинной радости. Это уникальный опыт, который ежедневно создается продукцией Russell Hobbs.</p>
                    <p><strong>Мы - Russell Hobbs, в сердце Вашего дома.</strong></p>

                </div>
            </Categories>
            <ShareLove />
        </div>;
    }
}

export default PageIndex;

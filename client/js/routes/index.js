import React from 'react';
import { IndexRoute, Route, NotFoundRoute } from 'react-router';
import App from '../containers/App';

import PageIndex from '../components/PageIndex';
import PageHistory from '../components/PageHistory';
import PageGames from '../components/PageGames';
import PageCatalog from '../components/PageCatalog';
import PageCollections from '../components/PageCollections';
import Page404 from '../components/Page404';
import PageCategory from '../components/PageCategory';

export default function configureRoutes() {
    return <Route path="/" component={App} location='history' name='Начальная страница'>

            <Route path="history/" component={PageHistory} name='История бренда'/>
            <Route path="games/" component={PageGames} name='Выиграй мечту'/>
            <Route path="catalog/" name='Продукты'>
                <Route path="collections/" name='Коллекции'>
                    <Route path=":code/" component={PageCategory} source='collections'/>
                    <IndexRoute component={PageCollections} />
                </Route>

                <Route path="categories/:code" component={PageCategory} source='categories'/>
                <IndexRoute component={PageCatalog} />
            </Route>
            <IndexRoute component={PageIndex} />
            <Route path="*" component={Page404} />
        </Route>;
}

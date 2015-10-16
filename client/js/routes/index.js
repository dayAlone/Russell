import React from 'react';
import { IndexRoute, Route, NotFoundRoute } from 'react-router';
import App from '../containers/App';
import PageIndex from '../components/PageIndex';
import PageHistory from '../components/PageHistory';
import PageGames from '../components/PageGames';
import PageCatalog from '../components/PageCatalog';
import PageCollections from '../components/PageCollections';
import Page404 from '../components/Page404';

export default function configureRoutes() {
    return <Route path="/" component={App} location='history'>

            <Route path="/history/" component={PageHistory} />
            <Route path="/games/" component={PageGames} />
            <Route path="/catalog">
                <Route path="/collections" component={PageCollections} />
                <IndexRoute component={PageCatalog} />
            </Route>
            <IndexRoute component={PageIndex} />
            <Route path="*" component={Page404} />
        </Route>;
}

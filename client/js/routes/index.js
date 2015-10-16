import React, { Component } from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../containers/App';
import PageIndex from '../components/PageIndex';
import PageHistory from '../components/PageHistory';
import PageGames from '../components/PageGames';
import PageCatalog from '../components/PageCatalog';
import PageCollections from '../components/PageCollections'

export default function configureRoutes(reducerRegistry) {
    return <Route path="/" component={App} location='history'>
                <Route path="/history/" component={PageHistory} />
                <Route path="/games/" component={PageGames} />
                <Route path="/catalog/">
                    <Route path="collections/" component={PageCollections} />
                    <IndexRoute component={PageCatalog} />
                </Route>
                <IndexRoute component={PageIndex} />
        </Route>;
}

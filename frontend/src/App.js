import React, { Component } from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'

import { store, history } from './app/store';

import Layout from './app/Layout';
import PersonGrid from './PersonGrid';
import Welcome from './Welcome';
import Main from './app/main/Main';

export default function App() {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Layout>
                    <Switch>
                        <Route path="/" exact component={Main}/>
                        <Route path="/welcome" component={Welcome}/>
                        <Route path="/grid" component={PersonGrid}/>
                    </Switch>
                </Layout>
            </ConnectedRouter>
        </Provider>
    )
}
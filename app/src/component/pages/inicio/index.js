import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Menu from '../../layout/menu';
import Header from '../../layout/header.js';

import Welcome from '../../pages/welcome';
import Dashboard from '../../pages/dashboard';
import NewQuery from '../../pages/helpcenter/newquery';
import ResponseQuery from '../../pages/helpcenter/newquery/response';
import StateQuery from '../../pages/helpcenter/statequery';
import NotFound from '../../pages/NotFound';

const Index = (props) => {

    const authentication = useSelector((state) => state.authentication.authentication)


    if (!authentication) {
        return <Redirect to="/login" />
    }

    const { path, url } = props.match;

    return (
        <>
            <Header {...props}/>

            <Menu {...props} url={url}/>

            <main className="app-content">
                <Switch>

                    <Route
                        path="/inicio"
                        exact={true}>
                        <Redirect to={`${path}/welcome`} />
                    </Route>

                    <Route
                        path={`${path}/welcome`}
                        exact={true}
                        render={(props) => <Welcome {...props} />}
                    />

                    <Route
                        path={`${path}/dashboard`}
                        exact={true}
                        render={(props) => <Dashboard {...props} />}
                    />
                    <Route
                        path={`${path}/new`}
                        exact={true}
                        render={(props) => <NewQuery {...props} />}
                    />
                    <Route
                        path={`${path}/new/response`}
                        exact={true}
                        render={(props) => <ResponseQuery {...props} />}
                    />
                    <Route
                        path={`${path}/state`}
                        exact={true}
                        render={(props) => <StateQuery {...props} />}
                    />

                    <Route component={NotFound} />
                </Switch>
            </main>
        </>
    );
}

export default Index;

import React, { useEffect } from "react";
import { Switch, Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Menu from '../../layout/menu';
import Header from '../../layout/header';

import Welcome from '../welcome/Welcome';
import Dashboard from '../dashboard/Dashboard';
import NewQuery from '../helpcenter/newquery/NewQuery';
import ResponseQuery from '../helpcenter/newquery/response/Response';
import StateQuery from '../helpcenter/statequery/StateQuery';
import NotFound from '../NotFound';

const Inicio = (props) => {

    const authentication = useSelector((state) => state.authentication.authentication)

    useEffect(() => {

        function onEventClick(event) {
            let overlaySidebar = document.getElementsByClassName("app-sidebar__overlay")[0];
            if (event.target === overlaySidebar) {
                const app = document.getElementsByClassName('app');
                app[0].classList.toggle('sidenav-toggled');
            }
        }

        window.addEventListener('click', onEventClick);

        return () => {
            window.removeEventListener('click', onEventClick);
        }
    }, []);

    if (!authentication) {
        return <Redirect to="/login" />
    }

    const { path, url } = props.match;

    return (
        <>
            <Header {...props} />

            <Menu {...props} url={url} />

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

export default Inicio;

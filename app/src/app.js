import React, { useEffect } from "react";
import { Switch, Route,Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Load from './component/pages/load';
import Login from './component/pages/login';
import Inicio from './component/pages/inicio';
import NotFound from './component/pages/NotFound';

function App() {

    const loading = useSelector((state) => state.authentication.loading)
    const authentication = useSelector((state) => state.authentication.authentication)

    useEffect(() => {

        function onEventClick(event) {
            let overlaySidebar = document.getElementsByClassName("app-sidebar__overlay")[0];
            if (event.target === overlaySidebar) {
                const app = document.getElementsByClassName('app');
                app[0].classList.toggle('sidenav-toggled')
            }
        }

        window.addEventListener('click', onEventClick);

        return () => {
            window.removeEventListener('click', onEventClick);
        }
    }, []);

    return (
        <>
            {
                loading ?
                    <Load />
                    :
                    <>
                        <Switch>

                            <Route
                                path="/"
                                exact={true}>
                                <Redirect to={"/login"} />
                            </Route>

                            <Route
                                path="/login"
                                exact={true}
                                render={(props) => <Login {...props} />}
                            />

                            <Route
                                path="/inicio"
                                render={(props) => <Inicio {...props} />}
                            />

                            <Route component={NotFound} />
                        </Switch>
                    </>
            }
        </>
    );
}

export default App;
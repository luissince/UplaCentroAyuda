import React from "react";
import { Switch, Route,Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Load from './view/load/Load';
import Login from './view/login';
import Inicio from './view/inicio/Inicio';
import NotFound from './view/pages/NotFound';

function App() {

    const loading = useSelector((state) => state.authentication.loading);

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
import React from "react";
import { Switch, Route,Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Load from './component/pages/load/Load';
import Login from './component/pages/login';
import Inicio from './component/pages/inicio/Inicio';
import NotFound from './component/pages/NotFound';

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
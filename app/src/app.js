import React, { useEffect } from "react";
import { Routes as Switch, Route } from "react-router-dom";

import { useSelector } from 'react-redux';

import Menu from './component/layout/menu';
import Header from './component/layout/header.js';

import Load from './component/pages/load';
import Login from './component/pages/login';
import Welcome from './component/pages/welcome';
import Inicio from './component/pages/inicio';
import NewQuery from './component/pages/helpcenter/newquery';
import ResponseQuery from './component/pages/helpcenter/newquery/response';
import StateQuery from './component/pages/helpcenter/statequery';
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
                        {
                            !authentication ?
                                <Switch>
                                    <Route
                                        path="/"
                                        element={<Login />}
                                    />
                                    <Route path="*" element={<div>Not found</div>} />
                                </Switch>
                                :
                                <>
                                    <Header />

                                    <Menu />

                                    <main className="app-content">
                                        <Switch>
                                            <Route
                                                path="/"
                                                element={<Welcome />}
                                            />
                                            <Route
                                                path="/inicio"
                                                element={<Inicio />}
                                            />
                                            <Route
                                                path="/new"
                                                element={<NewQuery />}
                                            />
                                            <Route 
                                                path="/response"
                                                element={<ResponseQuery />}
                                            />
                                            <Route
                                                path="/state"
                                                element={<StateQuery />}
                                            />
                                            <Route path="*" element={<NotFound />} />
                                        </Switch>
                                    </main>
                                </>
                        }
                    </>
            }
        </>
    );
}

export default App;
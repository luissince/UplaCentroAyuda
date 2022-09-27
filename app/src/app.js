import React, { useEffect } from "react";
import { Routes as Switch, Route } from "react-router-dom";

import { useSelector } from 'react-redux';

import Menu from './component/layout/menu';
import Header from './component/layout/header.js';

import Load from './component/load/Load';
import Login from './component/login/Login';
import Welcome from './component/welcome/Welcome';
import Inicio from './component/inicio';
import NewQuery from './component/helpcenter/newquery';
import ResponseQuery from './component/helpcenter/newquery/response';
import StateQuery from './component/helpcenter/statequery';
import Report from './component/report/Report';
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
                                            <Route
                                                path="/report"
                                                element={<Report />}
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
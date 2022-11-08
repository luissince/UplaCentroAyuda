import React, { useEffect } from 'react';
import '../../../assets/css/loader.css';
import { useDispatch } from 'react-redux';
import { restore } from '../../../store/authSlice';

const Load = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        const login = window.localStorage.getItem("login");
        if (login == null) {
            const user = null;
            const authentication = false;
            dispatch(restore({ user: user, authentication: authentication }));
        } else {
            const user = JSON.parse(login)
            const authentication = true;
            dispatch(restore({ user: user, authentication: authentication }));
        }
    }, []);

    return (
        <>
            <div className="loader text-center">
                <div className="loader-inner">

                    <div className="lds-roller mb-3">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <h4 className="text-uppercase font-weight-bold">Cargando...</h4>
                    <p className="font-italic text-muted">Se está estableciendo conexión con el servidor...</p>
                </div>
            </div>
        </>
    );
}

export default Load;
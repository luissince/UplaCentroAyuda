import React, { useEffect } from 'react';
import '../../assets/css/loader.css';
import { useDispatch } from 'react-redux';
import { restore, starting } from '../../store/authSlice';
import { validToken } from '../../api/rutas';

const Load = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        valid();
    }, []);

    const valid = async () => {
        try {
            const login = window.localStorage.getItem("login");
            if (login == null) {
                dispatch(starting());
            } else {
                await validToken(JSON.parse(login).token);
                const user = JSON.parse(login)
                const authentication = true;
                dispatch(restore({ user: user, authentication: authentication }));
            }
        } catch (error) {
            dispatch(starting());
        }
    }

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
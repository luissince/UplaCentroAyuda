import React, { useRef, useState } from "react";
import { Redirect } from 'react-router-dom';

import { getLogin } from '../../api/rutas';

import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';

import { useSelector } from 'react-redux';

import { NotificationContainer, NotificationManager } from 'react-notifications';
import { images } from '../../constants';

const Index = (props) => {

    const [codigo, setCodigo] = useState('');
    const [clave, setClave] = useState('');
    const [message, setMessage] = useState('');
    const [process, setProcess] = useState(false);

    const refCodigo = useRef(null);
    const refClave = useRef(null);

    const dispatch = useDispatch();
    const authentication = useSelector((state) => state.authentication.authentication)

    const onEventLogin = async () => {
        if (codigo == "") {
            NotificationManager.warning("Ingrese su codigo.", "Login");
            refCodigo.current.focus();
            return;
        }

        if (clave == "") {
            NotificationManager.warning("Ingrese su Contraseña.", "Login");
            refClave.current.focus();
            return;
        }

        setProcess(true);

        try {
            const request = await getLogin({
                "codigo": codigo,
                "clave": clave
            })

            dispatch(login({ user: request.data }));
            props.history.push("inicio");
        } catch (error) {
            setProcess(false);
            if (error.response) {
                setMessage(error.response.data);
            } else {
                setMessage("Se produjo un error de conexión, intente nuevamente.");
            }
        }
    }
   
    if (authentication) {
        return <Redirect to="/inicio" />
    }

    return <>
        <section className="material-half-bg-white">
            <div className="cover"></div>
        </section>
        <section className="login-content">

            <div className="tile p-0">
                {
                    process ?
                        <div className="overlay">
                            <div className="m-loader mr-4">
                                <svg className="m-circular" viewBox="25 25 50 50">
                                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                                </svg>
                            </div>
                            <h4 className="l-text text-white">Procesando Petición...</h4>
                        </div>
                        :
                        null
                }


                <div className="tile-body">
                    <div className="login-box">
                        <div className="login-form">
                            <h4 className="text-center mb-3">
                                <img className="img-fluid" src={images.logo_upla} alt="Logo" />
                            </h4>
                            <h4 className="login-head"><i className="fa fa-fw fa-info"></i>Credenciales de Acceso</h4>
                            <div className="form-group">
                                <label className="control-label">Código</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Dijite su código"
                                    ref={refCodigo}
                                    value={codigo}
                                    onChange={(event) => setCodigo(event.target.value)}

                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") {
                                            onEventLogin();
                                            event.preventDefault();
                                        }
                                    }}
                                    autoFocus />
                            </div>
                            <div className="form-group">
                                <label className="control-label">Contraseña</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Dijite la contraseña"
                                    ref={refClave}
                                    value={clave}
                                    onChange={(event) => setClave(event.target.value)}

                                    onKeyUp={(event) => {
                                        if (event.key === "Enter") {
                                            onEventLogin();
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group btn-container">
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => onEventLogin()}>
                                    <i className="fa fa-sign-in fa-lg fa-fw"></i> Ingresar
                                </button>
                            </div>
                            <div className="form-group text-center">
                                <label className="control-label text-danger">{message}</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <NotificationContainer />
        </section>
    </>
}

export default Index;
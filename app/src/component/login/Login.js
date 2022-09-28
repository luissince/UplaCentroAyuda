import React, { useRef, useState } from "react";
import axios from "axios";

import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';

import { NotificationContainer, NotificationManager } from 'react-notifications';
import { images } from '../../constants/';

const Login = () => {

    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [message, setMessage] = useState('');
    const [process, setProcess] = useState(false);

    const refUsuario = useRef(null);
    const refClave = useRef(null);

    const dispatch = useDispatch()

    const onEventLogin = async () => {
        if (usuario == "") {
            NotificationManager.warning("Ingrese su usuario.", "Login");
            refUsuario.current.focus();
            return;
        }

        if (clave == "") {
            NotificationManager.warning("Ingrese su Contraseña.", "Login");
            refClave.current.focus();
            return;
        }

        setProcess(true);

        try {
            let request = await axios.post("/api/user/login", {
                "email": usuario,
                "clave": clave
            });

            dispatch(login({ user: request.data }))
        } catch (error) {
            setProcess(false);
            if (error.response) {
                setMessage(error.response.data);
            } else {
                setMessage("Se produjo un error de conexión, intente nuevamente.");
            }
        }
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
                                <label className="control-label">Email</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Dijite el correo electrónico"
                                    ref={refUsuario}
                                    value={usuario}
                                    onChange={(event) => setUsuario(event.target.value)}

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

export default Login;
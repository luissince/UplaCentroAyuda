import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../../store/authSlice';
import { add, clear } from '../../store/notifeSlice';
import { images, sounds } from '../../constants';

const Header = () => {

    let navigate = useNavigate();

    const authentication = useSelector((state) => state.authentication);
    const notifications = useSelector((state) => state.notifications.notifications);

    const dispatch = useDispatch();

    // const [count, setCount] = useState(0);
    // const audio = useMemo(() => new Audio(sounds.mixkit), []);


    const hideSidebar = () => {
        const app = document.getElementsByClassName('app');
        app[0].classList.toggle('sidenav-toggled');
    }

    const onEventCloseSession = () => {
        dispatch(logout())
        dispatch(clear());
        navigate("/", { replace: true });
    }

    return (
        <header className="app-header">

            <Link className="app-header__logo" to={"/"}>UPLA</Link>
            {/* Sidebar toggle button */}
            <span className="app-sidebar__toggle" data-bs-toggle="sidebar" aria-label="Hide Sidebar" onClick={() => hideSidebar()}></span>
            {/* Navbar Right Menu */}
            <ul className="app-nav">
                <li className="dropdown">
                    <a className="app-nav__item"
                        href=""
                        data-bs-toggle="dropdown"
                        aria-label="Show notifications">
                        <i className="fa fa-bell-o fa-sm"></i>
                        <span className="pl-1 pr-1 badge-warning rounded h7 icon-absolute ">{notifications.length}</span>
                    </a>
                    <ul className="app-notification dropdown-menu dropdown-menu-right">
                        <li className="app-notification__title">Tu tienes {notifications.length == 0 ? " 0 notificaciones" : notifications.length == 1 ? " nueva notificación" : notifications.length + " nuevas notificaciones"}  </li>
                        <div className="app-notification__content">
                            {
                                notifications.length == 0 ?
                                    <li>
                                        <span className="app-notification__item" >
                                            <span className="app-notification__icon">
                                                <span className="fa-stack fa-lg">
                                                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                                    <i className="fa fa-refresh fa-stack-1x fa-inverse"></i>
                                                </span>
                                            </span>
                                            <div>
                                                <p className="app-notification__message">Nada para mostrar</p>
                                                <p className="app-notification__meta">Sin notificaciones</p>
                                            </div>
                                        </span>
                                    </li>
                                    :
                                    notifications.map((item, index) => (
                                        <li key={index}>
                                            <span className="app-notification__item" >
                                                <span className="app-notification__icon">
                                                    <span className="fa-stack fa-lg">
                                                        <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                                        <i className="fa fa-envelope fa-stack-1x fa-inverse"></i>
                                                    </span>
                                                </span>
                                                <div>
                                                    <p className="app-notification__message">Notificación {item}</p>
                                                    <p className="app-notification__meta">Nueva notificatión</p>
                                                </div>
                                            </span>
                                        </li>
                                    ))
                            }
                        </div>
                        <li className="app-notification__footer"><Link to="/"> Mostrar mas a detalle</Link></li>
                    </ul>
                </li>

                <li className="dropdown">
                    <a className="app-nav__item"
                        href=""
                        data-bs-toggle="dropdown"
                        aria-label="Abrir Perfil"
                        aria-expanded="false">
                        <img src={images.usuario} className="user-image" alt="Usuario" />
                    </a>
                    <ul className="dropdown-menu settings-menu dropdown-menu-right">
                        <li className="user-header">
                            <img src={images.usuario} className="img-circle" alt="Usuario" />
                            <p>
                                <span>{authentication.user.nombres + ", " + authentication.user.apellidos}</span>
                                <small> <i></i> Administrador</small>
                            </p>
                        </li>
                        <li className="user-footer">
                            <div className="pull-left">
                                <a href="perfil.php" className="btn btn-secondary btn-flat">
                                    <i className="fa fa-user fa-sm"></i> Perfil Usuario
                                </a>
                            </div>
                            <div className="pull-right">
                                <button onClick={() => onEventCloseSession()} className="btn btn-secondary btn-flat">
                                    <i className="fa fa-sign-out fa-sm"></i> Cerrar Sesión
                                </button>
                            </div>
                        </li>

                    </ul>
                </li>

            </ul>
        </header>
    );
}

export default Header;
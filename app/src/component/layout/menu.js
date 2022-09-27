import React from "react";
import { Link  } from 'react-router-dom';
import {images } from '../../constants';

const Menu = () => {

    const treeViewMenu = (event) => {
        event.preventDefault();

        const value = document.querySelectorAll('.app-menu li .app-menu__item[data-bs-toggle="treeview"]');

        value.forEach(rmElement => {
            if (!event.currentTarget.parentNode.classList.contains("is-expanded")) {
                rmElement.parentNode.classList.remove("is-expanded");
            }
        });

        event.currentTarget.parentNode.classList.toggle("is-expanded")
    }

    return <>
        <div className="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
        <aside className="app-sidebar">
            <div className="app-sidebar__user">
                <div className="m-2">
                    <img className="img-fluid" src={images.logo_only} alt="User Image" />
                </div>

                <div className="m-1">
                    <p className="app-sidebar__user-name">CENTRO DE AYUDA</p>
                </div>
            </div>
            <ul className="app-menu">

                <li>
                    <Link className="app-menu__item" id="tab-index" to={"inicio"}>
                        <i className="app-menu__icon fa fa-home"></i>
                        <span className="app-menu__label">Inicio</span>
                    </Link>
                </li>

                <li className="treeview" id="treeview-ingresos">
                    <a
                        className="app-menu__item"
                        href="#"
                        data-bs-toggle="treeview"
                        aria-expanded="false"
                        role="button"
                        onClick={(event) => treeViewMenu(event)}>
                        <i className="app-menu__icon fa fa-question-circle"></i>
                        <span className="app-menu__label">Centro de Ayuda</span>
                        <i className="treeview-indicator fa fa-angle-right"></i>
                    </a>
                    <ul className="treeview-menu">
                        <li><Link className="app-menu__item" id="tab-ventas" to={"new"}><i className="app-menu__icon fa fa-circle-o"></i><span className="app-menu__label">Nueva consulta</span></Link></li>
                        <li><Link className="app-menu__item" id="tab-pago" to={"state"}><i className="app-menu__icon fa fa-circle-o"></i><span className="app-menu__label">Estado consulta</span></Link></li>
                    </ul>
                </li>
            </ul>
        </aside>
    </>
}

export default Menu;
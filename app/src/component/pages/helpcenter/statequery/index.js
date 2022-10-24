import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { listConsult,sendConsulta } from '../../../../api/rutas';

const Index = () => {

    const [loading, setLoading] = useState(false);
    const [lista, setLista] = useState([]);
    const [restart, setRestart] = useState(false);

    // const [paginacion, setPaginacion] = useState(0);
    const paginacion = useRef(0);
    const [totalPaginacion, setTotalPaginacion] = useState(0);
    const [filasPorPagina, setFilasPorPagina] = useState(10);
    const messageTable = useRef('Cargando información...');
    const messagePaginacion = useRef('Mostranto 0 de 0 Páginas');

    const authentication = useSelector((state) => state.authentication);

    useEffect(() => {

        loadInit();
    }, []);

    const loadInit = async () => {
        if (loading) return;

        paginacion.current = 1;
        setRestart(true);

        fillTable();

    }

    const fillTable = async (opcion, buscar) => {
        try {
            setLoading(true);
            setLista([]);

            const response = await listConsult({
                posicionPagina: ((paginacion.current - 1) * filasPorPagina),
                filasPorPagina: filasPorPagina
            }, authentication.user.token);

            console.log(response.data)
            setLista(response.data.result);
            setLoading(false);
        } catch (error) {
            setLista([]);
            setLoading(false);
            messageTable.current = "Se produjo un error interno, intente nuevamente por favor.";
            messagePaginacion.current = "Mostranto 0 de 0 Páginas";
        }
    }

    const onEventCambiar = async (event) => {
        try{
            const response = await sendConsulta(authentication.user.token);
            NotificationManager.warning("Cambio envíado.", "");
        }catch(error){

        }
    }

    return (
        <>
            <div className="app-title">
                <h1><i className="fa fa-list-ul"></i> Estado Consulta <small>Centro de Ayuda</small></h1>
            </div>

            <div className="row">
                {/* <div className="col-md-3">
                    <button className="mb-2 btn btn-primary btn-block" >asd</button>

                    <div className="tile p-0">
                        <h4 className="tile-title folder-head">Consultas</h4>
                        <div className="tile-body">
                            <ul className="nav nav-pills flex-column mail-nav">
                                <li className="nav-item show">
                                    <a className="nav-link" href="#"><i className="fa fa-lightbulb-o fa-fw"></i> Pendientes <span className="badge badge-pill badge-warning float-right">0</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#"><i className="fa fa fa-spinner fa-fw"></i> Progreso <span className="badge badge-pill badge-primary float-right">0</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#"><i className="fa fa-handshake-o fa-fw"></i> Resueltos <span className="badge badge-pill badge-success float-right">0</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#"><i className="fa fa-filter fa-fw"></i> Cerrados <span className="badge badge-pill badge-info float-right">0</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#"><i className="fa fa-ban fa-fw"></i> Cancelados <span className="badge badge-pill badge-danger float-right">0</span></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div> */}
                <div className="col-md-12">
                    <div className="tile">
                        <div className="mailbox-controls b-0">
                            <div className="btn-group">
                                <input type="search" className="form-control" placeholder="Buscar..." aria-controls="sampleTable" />
                            </div>
                            <div className="btn-group">
                                <button className="btn btn-primary" type="button"><i className="fa fa-refresh"></i></button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Título</th>
                                            <th>Descripción</th>
                                            <th>Tipo</th>
                                            <th>Estado</th>
                                            <th>Creado</th>
                                            <th>Cambiar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading ?
                                            <tr className="text-center">
                                            <td colSpan="7">{messageTable.current}</td>
                                        </tr>
                                            :
                                            lista.length == 0 ?
                                                <tr className="text-center">
                                                    <td colSpan="7">{messageTable.current}</td>
                                                </tr>
                                                :
                                                lista.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{item.id}</td>
                                                        <td>{item.asunto}</td>
                                                        <td className="mail-subject">{item.descripcion}</td>
                                                        <td>{item.tipoConsulta}</td>
                                                        <td>{item.estado}</td>
                                                        <td>{item.estudiante}</td>
                                                        <td className="text-center">
                                                            <button 
                                                            className="btn btn-warning"
                                                            onClick={onEventCambiar}>
                                                                <i className="fa fa-edit"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-5">
                                <div className="dataTables_info mt-2" role="status" aria-live="polite"><span className="text-muted"> Mostrando 10 de 6 Páginas</span> </div>
                            </div>
                            <div className="col-sm-12 col-md-7">
                                <div className="dataTables_paginate paging_simple_numbers">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-end">
                                            <li className="page-item disabled">
                                                <span className="page-link"> Ante. </span></li>
                                            <li className="page-item active" aria-current="page">
                                                <span className="page-link">1</span></li>
                                            <li className="page-item disabled">
                                                <span className="page-link"> Sigui. </span>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="tile mb-4"> */}

            {/* <div className="overlay p-5">
                    <div className="m-loader mr-4">
                        <svg className="m-circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                        </svg>
                    </div>
                    <h4 className="l-text text-center text-white p-10">Cargando información...</h4>
                </div> */}

            {/* <h4 className="tile-title"><i className="fa fa-file-text"></i> Registrar tu consulta</h4> */}



            {/* </div> */}
            <NotificationContainer />
        </>
    );
}

export default Index;
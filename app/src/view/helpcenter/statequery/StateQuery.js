import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { starting } from '../../../store/authSlice';

import { NotificationContainer, NotificationManager } from 'react-notifications';

import { listConsult, sendConsulta, getIdConsult } from '../../../api/rutas';
import {
    showModal,
    hideModal,
    viewModal,
    clearModal,
    keyUpSearch,
    ModalAlertDialog,
    ModalAlertInfo,
    ModalAlertSuccess,
    ModalAlertCatch
} from '../../../constants/tools';

import { images } from '../../../constants';

import Paginacion from '../../../component/pagination';

/**
 * 
 */
const StateQuery = () => {

    /**
     * Variables para mostrar en la tabla y validar el estado de la carga
     * loading = se encarga de validar el proceso de varga de datos
     * list = almacena la data de la consulta echa
     * restart = reiniciar el contado de la paginación
     */
    const refBuscar = useRef(null);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const restart = useRef(false);
    // const [paginacion, setPaginacion] = useState(0);
    const opcion = useRef(0);
    const paginacion = useRef(0);
    const totalPaginacion = useRef(0);
    const filasPorPagina = useRef(10);
    const messageTable = useRef('Cargando información...');
    const messagePaginacion = useRef('Mostranto 0 de 0 Páginas');

    /**
     * Variable para manejar el estado del modal
     * idConsulta =
     * loadingModal =
     * messageModal =
     * ticket =
     * estado =
     * usuario =
     * celular =
     * telefono =
     * correo =
     * asunto =
     * descripcion =
     * consulta =
     * refConsulta =
     */
    const idConsulta = useRef('');
    const [loadingModal, setLoadingModal] = useState(false);
    const [messageModal, setMessageModal] = useState("Cargado inforamción...");
    const [ticket, setTicket] = useState("");
    const [estado, setEstado] = useState("");
    const [usuario, setUsuario] = useState("");
    const [celular, setCelular] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [asunto, setAsunto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [consulta, setConsulta] = useState("");
    const refConsulta = useRef(null);

    /**
     * Variable encargadas de anular le request o solicitud a las apis solicitadas
     */
    const abortControlleTable = useRef(new AbortController());
    const abortControlleModal = useRef(null);

    /**
     * Variable encargada de obtener el estado global de la aplicación usando redux
     */
    const authentication = useSelector((state) => state.authentication);

    /**
     * Variable encargada de ejecutar los eventos de redux
     */
    const dispatch = useDispatch();

    /**
     * useEffect es un hook que se encarga de obtener el cambio de una variable o 
     * o tambien es usado como metodo que se ejecuta al terminar de realizar el render
     */
    useEffect(() => {
        loadInit();

        viewModal("modalCambiar", () => {
            abortControlleModal.current = new AbortController();
            setLoadingModal(true);
            setMessageModal("Cargado inforamción...");
            loadData();
        });

        clearModal("modalCambiar", async () => {
            abortControlleModal.current.abort();
            setTicket("");
            setEstado("");
            setUsuario("");
            setCelular("");
            setTelefono("");
            setCorreo("");
            setAsunto("");
            setDescripcion("");
            setLoadingModal(false);
            setMessageModal("Cargado inforamción...");
        });
        return () => {
            abortControlleTable.current.abort();
        }
    }, []);

    /**
     * 
     * @returns 
     */
    const loadInit = () => {
        if (loading) return;

        paginacion.current = 1;
        restart.current = true;
        fillTable(0, "");

        opcion.current = 0;
    }

    /**
     * 
     */
    const searchText = (text) => {
        if (loading) return;

        if (text.trim().length === 0) return;

        paginacion.current = 1;
        restart.current = false;

        fillTable(1, text.trim());

        opcion.current = 1;
    }

    /**
     * 
     */
    const paginacionContext = (listid) => {
        paginacion.current = listid;
        restart.current = false;
        onEventPaginacion();
    }

    /**
     * 
     */
    const onEventPaginacion = () => {
        switch (opcion.current) {
            case 0:
                fillTable(0, "");
                break;
            case 1:
                fillTable(1, refBuscar.current.value);
                break;
            default: fillTable(0, "");
        }

    }


    /**
     * 
     * @param {*} opcion 
     * @param {*} buscar 
     */
    const fillTable = async (opcion, buscar) => {
        try {
            setLoading(true);
            setList([]);

            const response = await listConsult({
                opcion: opcion,
                buscar: buscar,
                posicionPagina: ((paginacion.current - 1) * filasPorPagina.current),
                filasPorPagina: filasPorPagina.current
            },
                authentication.user.token,
                abortControlleTable.current.signal
            );

            totalPaginacion.current = parseInt(Math.ceil((parseFloat(response.data.total) / filasPorPagina.current)));
            messagePaginacion.current = `Mostrando ${response.data.result.length} de ${totalPaginacion.current} Páginas`;

            setList(response.data.result);
            messageTable.current = "No hay datos para mostrar.";
            setLoading(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    dispatch(starting());
                }
            }

            if (error.message !== "canceled") {
                setList([]);
                messageTable.current = "Se produjo un error interno, intente nuevamente por favor.";
                messagePaginacion.current = "Mostranto 0 de 0 Páginas";
                setLoading(false);
            }
        }
    }

    /**
     * 
     * @param {*} id 
     */
    const openModal = async (id) => {
        idConsulta.current = id;
        showModal('modalCambiar');
    }

    /**
     * 
     */
    const loadData = async () => {
        try {
            const response = await getIdConsult(
                idConsulta.current,
                authentication.user.token,
                abortControlleModal.current.signal
            );

            setTicket(response.data.ticket);
            setEstado(response.data.estado);
            setUsuario(response.data.estudiante);
            setCelular(response.data.celular);
            setTelefono(response.data.telefono);
            setCorreo(response.data.email);
            setAsunto(response.data.asunto);
            setDescripcion(response.data.descripcion);
            setLoadingModal(false);
        } catch (error) {
            if (error.message !== "canceled") {
                setMessageModal("No se pudo cargar la información, comuníquese con el área de informatica.");
            }
        }
    }

    /**
     * 
     */
    const onSaveRespuesta = async () => {
        if (idConsulta == "") {
            NotificationManager.warning("No se pudo cargar la información.", "Centro de Ayuda");
            return;
        }

        if (consulta.trim() == "") {
            NotificationManager.warning("Ingrese la respuesta de la consulta.", "Centro de Ayuda");
            refConsulta.current.focus();
            return;
        }

        ModalAlertDialog("Centro de Ayuda", "¿Está seguro de continuar?", async () => {
            try {
                ModalAlertInfo("Centro de Ayuda", "Procesando registro...");
                hideModal("modalCambiar");

                const response = await sendConsulta({
                    "idConsulta": idConsulta.current,
                    "c_cod_usuario": authentication.user.docNumId,
                    "detalle": consulta.trim(),
                    "token": authentication.user.token
                });

                ModalAlertSuccess("Centro de Ayuda", response.data, () => {
                    loadInit();
                });
            } catch (error) {
                ModalAlertCatch("Centro de Ayuda", error);
            }
        });
    }

    /**
     * 
     */
    return (
        <>
            {/* Inicio modal */}
            <div className="modal fade" id="modalCambiar" data-backdrop="static">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title"><i className="fa fa-question-circle"></i> Centro de Ayuda</h4>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="tile p-0 border-0">
                                {
                                    loadingModal ?
                                        <div className="overlay">
                                            <div className="m-loader mr-4">
                                                <svg className="m-circular" viewBox="25 25 50 50">
                                                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                                                </svg>
                                            </div>
                                            <h5 className="l-text text-center text-white p-10">{messageModal}</h5>
                                        </div>
                                        : null
                                }

                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label"># Ticket:</label>
                                        <p className="text-info mb-0">{ticket}</p>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="control-label">Estado:</label>
                                        <p className="lead mb-0"><span className="badge badge-success">{estado}</span></p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Usuario</label>
                                    <p className="text-info mb-0">{usuario}</p>
                                </div>

                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label">Nrm. Celular:</label>
                                        <p className="text-info mb-0">{celular}</p>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label className="control-label">Nrm. Teléfono:</label>
                                        <p className="text-info mb-0">{telefono}</p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label">Correo Electrónico:</label>
                                        <p className="text-info mb-0">{correo}</p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Asunto:</label>
                                    <p className="text-info">{asunto}</p>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Descripción:</label>
                                    <p className="text-info">{descripcion}</p>
                                </div>

                                <div className="form-group">
                                    <label className="control-label">Responde consulta:</label>
                                    <textarea
                                        ref={refConsulta}
                                        value={consulta}
                                        onChange={(event) => setConsulta(event.target.value)}
                                        className="form-control"
                                        rows="3"
                                        placeholder="Ingrese la respuesta a la consulta."
                                    >
                                    </textarea>
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={onSaveRespuesta}>Guardar</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* fin modal */}

            <div className="app-title">
                <h1><i className="fa fa-list-ul"></i> Estado Consulta <small>Centro de Ayuda</small></h1>
            </div>

            <div className="row">
                <div className="col-md-3">
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
                </div>

                <div className="col-md-9">
                    <div className="tile">
                        <div className="mailbox-controls b-0">
                            <div className="btn-group">
                                <input
                                    type="search"
                                    ref={refBuscar}
                                    // value={buscar}
                                    // onChange={(event) => setBuscar(event.target.value)}
                                    onKeyUp={(event) => keyUpSearch(event, () =>searchText(event.target.value))}
                                    className="form-control"
                                    placeholder="Buscar..."
                                    aria-controls="sampleTable"
                                />
                            </div>
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={loadInit}>
                                    <i className="fa fa-refresh"></i>
                                </button>
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
                                            <th>Usuario</th>
                                            <th>Cambiar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading ?
                                                <tr className="text-center">
                                                    <td colSpan="7"><img src={images.loading} id="imgLoad" width="34" height="34" /> <p>{messageTable.current}</p></td>
                                                </tr>
                                                :
                                                list.length == 0 ?
                                                    <tr className="text-center">
                                                        <td colSpan="7">{messageTable.current}</td>
                                                    </tr>
                                                    :
                                                    list.map((item, index) => (
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
                                                                    onClick={() => openModal(item.idConsulta)}>
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
                                            <Paginacion
                                                loading={loading}
                                                totalPaginacion={totalPaginacion.current}
                                                paginacion={paginacion.current}
                                                fillTable={paginacionContext}
                                                restart={restart.current}
                                            />
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

export default StateQuery;
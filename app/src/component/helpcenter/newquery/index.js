import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { images } from "../../../constants";
import {
    ModalAlertInfo,
    ModalAlertDialog,
    ModalAlertSuccess,
    ModalAlertWarning,
    ModalAlertError,
} from "../../../constants/tools";

const Index = () => {

    const [asunto, setAsunto] = useState('');
    const [tipoConsulta, setTipoConsulta] = useState('');
    const [contacto, setContacto] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const refAsunto = useRef(null);
    const refTipoConsulta = useRef(null);
    const refContacto = useRef(null);
    const refDescripcion = useRef(null);

    const authentication = useSelector((state) => state.authentication);

    const navigate = useNavigate();

    const onEventSendTicket = async () => {

        if (asunto.length == 0) {
            refAsunto.current.focus();
            return;
        }

        if (tipoConsulta.length == 0) {
            refTipoConsulta.current.focus();
            return;
        }

        if (contacto.length == 0) {
            refContacto.current.focus();
            return;
        }

        if (descripcion.length == 0) {
            refDescripcion.current.focus();
            return;
        }

        ModalAlertDialog("Consulta", "¿Está seguro de continuar?", async () => {
            try {
                ModalAlertInfo("Consulta", "Procesando registro...");

                const request = await axios.post("/api/consult/", {
                    "asunto": asunto,
                    "tipoConsulta": tipoConsulta,
                    "contacto": contacto,
                    "descripcion": descripcion,
                    "estado": 1,
                    "idUsuario": authentication.user.idUsuario
                }, {
                    headers: {
                        'Authorization': `Bearer ${authentication.user.token}`
                    }
                });
                ModalAlertSuccess("Consulta", request.data);
            } catch (error) {
                console.log(error);
                ModalAlertWarning("Consulta", "Se produjo un error de servidor, intente nuevamente.");
            }
        });


        // navigate("/response");
    }

    return (
        <>
            <div className="app-title">
                <h1><i className="fa fa-plus"></i> Nueva consulta <small>Centro de Ayuda</small></h1>
            </div>

            <div className="tile mb-4">

                {/* <div className="overlay p-5">
                    <div className="m-loader mr-4">
                        <svg className="m-circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                        </svg>
                    </div>
                    <h4 className="l-text text-center text-white p-10">Cargando información...</h4>
                </div> */}

                <h4 className="tile-title"><i className="fa fa-file-text"></i> Registrar tu consulta</h4>

                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="form-group">
                            <button className="btn btn-primary" onClick={onEventSendTicket}>
                                <i className="fa fa-send"></i> Generar Ticket
                            </button>
                            {" "}
                            <button className="btn btn-secondary" id="btnReload">
                                <i className="fa fa-trash"></i> Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bs-component">
                    <div className="alert alert-dismissible alert-warning">
                        <h4><i className="fa fa-warning"></i> Importante</h4>
                        <p>Accede y absuelve todas tus consultas buscando en la <a href="#">UplaGuia</a> tus trámites y preguntas frecuentes. Si no encuentras la respuesta que buscas, registra tu consulta espeficica en los campoo siguientes.</p>
                        <h4><i className="fa fa-arrow-right"></i> Condisideraciones:</h4>
                        <ul>
                            <li>Una vez registrada tu consulta, haz siguiento a tu respuesta en las proximas 48 horas hábiles <a href="#">aquí</a></li>
                            <li>Evita saturar los otros canales de atención realizando la misma consutal registrada aquí.</li>
                        </ul>
                        <h4><i className="fa fa-info-circle"></i> Recuerda</h4>
                        <p>Al generar le ticket se te envíara la confirmación a tu correo institucional o personal con el detalle del ticket generado.</p>
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label">Asunto</label>
                    {/* is-invalid */}
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Asunto de la consulta"
                        ref={refAsunto}
                        value={asunto}
                        onChange={(event) => setAsunto(event.target.value)}
                    />
                    <div className="col-form-label-sm text-danger">Min. 20 caracteres</div>
                </div>

                <div className="form-group">
                    <label className="control-label">Tipo de Consulta</label>
                    <select
                        className="form-control"
                        ref={refTipoConsulta}
                        value={tipoConsulta}
                        onChange={(event) => setTipoConsulta(event.target.value)}>
                        <option value="">Seleccione</option>
                        <option value="1">Atención</option>
                        <option value="2">Incidencia</option>
                        <option value="3">Orientación</option>
                        <option value="4">Queja o reclamo</option>
                        <option value="5">Sugerencia</option>
                    </select>
                </div>

                {/* is-valid */}
                <div className="form-group">
                    <label className="control-label">Cel. / Tel.</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Ingrese un número para comunicarse."
                        ref={refContacto}
                        value={contacto}
                        onChange={(event) => setContacto(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="control-label">Archivo</label>
                    <div className="card">
                        <h4 className="card-header"><button className="btn btn-primary"><i className="fa fa-cloud-upload"></i> Adjuntar</button></h4>
                        <div className="card-body">
                            <h6 className="card-subtitle text-muted">Máx 20MB por achivo</h6>
                            <div className="card-body">

                                <div className="media text-muted pt-3">
                                    <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <strong className="text-gray-dark"><i className="fa fa-file"></i> Nombre del Archivo</strong>
                                            <button className="btn btn-outline-danger"><i className="fa fa-trash"></i></button>
                                        </div>
                                        {/* <span className="d-block">Lista para subir.</span> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label">Descripción</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Descripción de la consulta."
                        ref={refDescripcion}
                        value={descripcion}
                        onChange={(event) => setDescripcion(event.target.value)}
                    ></textarea>
                    <div className="col-form-label-sm text-danger">Min. 40 caracteres</div>
                </div>

            </div>
        </>
    );
}

export default Index;
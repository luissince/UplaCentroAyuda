import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { addConsult } from '../../../../api/rutas';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import {
    ModalAlertInfo,
    ModalAlertDialog,
    ModalAlertSuccess,
    ModalAlertCatch,
    imageBase64
} from "../../../../constants/tools";

import { filterStudent } from '../../../../api/rutas';

import SearchStudent from "../../../part/search_student";

const Index = (props) => {
    const selectItem = useRef(false);
    const filter = useRef(false);
    
    const [idStudent,setIdStudent] = useState('');
    const [student, setStudent] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [asunto, setAsunto] = useState('');
    const [tipoConsulta, setTipoConsulta] = useState('');
    const [contacto, setContacto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [files, setFiles] = useState([]);

    const refStudent = useRef(null);
    const refAsunto = useRef(null);
    const refTipoConsulta = useRef(null);
    const refContacto = useRef(null);
    const refDescripcion = useRef(null);
    const refAdjuntar = useRef(null);

    const authentication = useSelector((state) => state.authentication);

    const onEventSendTicket = async () => {
        if(idStudent == ""){
            refStudent.current.focus();
            return;
        }

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

                const newArray = [];
                for (const value of files) {
                    const result = await imageBase64(value);
                    if (typeof result == "object") {
                        newArray.push(result);
                    }
                }

                const request = await addConsult({
                    "asunto": asunto,
                    "tipoConsulta": tipoConsulta,
                    "contacto": contacto,
                    "descripcion": descripcion,
                    "estado": 1,
                    "files": newArray,
                    "Est_Id": idStudent,
                    "c_cod_usuario": authentication.user.docNumId,
                    "token": authentication.user.token
                });

                ModalAlertSuccess("Consulta", request.data.message, () => {
                    props.history.push({
                        pathname: `${props.match.path}/response`,
                             state: {
                            "idConsulta": request.data.idConsulta,
                            "token": authentication.user.token
                        }
                    });
                });
            } catch (error) {
                ModalAlertCatch("Consulta", error);
            }
        });
    }

    const onEventFileLogo = async (event) => {
        if (event.target.files.length !== 0) {
            if (event.target.files[0].type !== "application/pdf") {
                NotificationManager.warning("El archivo a subir tiene que ser formato pdf.", "Consulta");
            }

            const filterName = files.filter((element, index) => element.name === event.target.files[0].name);
            if (filterName.length == 0) {
                setFiles(data => [...data, event.target.files]);
            } else {
                NotificationManager.warning("Hay un archivo con el mismo nombre.", "Consulta");
            }
        } else {
            refAdjuntar.current.value = "";
        }
    }

    const onEventRemoveFile = (remove) => {
        const arrTemp = files.filter((element, index) => remove != index);
        setFiles(arrTemp);
    }

    const handleFilter = async (event) => {
        const searchWord = selectItem.current ? "" : event.target.value;
        setStudent(searchWord);
        selectItem.current = false;
        if (searchWord.length === 0) {
            setFilteredData([]);
            return;
        }

        if (filter.current) return;

        filter.current = true;

        const response = await filterStudent(searchWord,authentication.user.token);
        setFilteredData(response);

        filter.current = false;
    }

    const onEventClearInput = () => {
        setStudent("");
        setIdStudent("");
        setFilteredData([]);
        selectItem.current = false;
    }

    const onEventSelectItem = (value) => {
        setStudent(value.DatosPersonales);
        setIdStudent(value.codigoEst);
        setFilteredData([]);
        selectItem.current = true;
    }


    return (
        <>
            <div className="app-title">
                <h1><i className="fa fa-plus"></i> Nueva consulta <small>Centro de Ayuda</small></h1>
            </div>

            <div className="tile mb-4">

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


                <SearchStudent
                    placeholder="Escribe para iniciar a filtrar al estudiante..."
                    refStudent={refStudent}
                    student={student}
                    filteredData={filteredData}
                    onEventClearInput={onEventClearInput}
                    handleFilter={handleFilter}
                    onEventSelectItem={onEventSelectItem} />

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
                    <label className="control-label">Archivo (PDF)</label>
                    <div className="card">
                        <h4 className="card-header">
                            <input
                                type="file"
                                id="filePdf"
                                accept=".pdf"
                                className="d-none"
                                onChange={onEventFileLogo}
                                ref={refAdjuntar} />
                            <button
                                htmlFor="filePdf"
                                className="btn btn-primary"
                                onClick={e => refAdjuntar.current && refAdjuntar.current.click()}>
                                <i className="fa fa-cloud-upload"></i> Adjuntar
                            </button>
                        </h4>
                        <div className="card-body">
                            <h6 className="card-subtitle text-muted">Máx 20MB por achivo</h6>
                            <div className="card-body">
                                {
                                    files.map((item, index) => {
                                        return (
                                            <div key={index} className="media text-muted pt-3">
                                                <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                                    <div className="d-flex justify-content-between align-items-center w-100">
                                                        <strong className="text-gray-dark"><i className="fa fa-file"></i> {item[0].name}</strong>
                                                        <button className="btn btn-outline-danger" onClick={() => onEventRemoveFile(index)}><i className="fa fa-trash"></i></button>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })
                                }
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

                <NotificationContainer />
            </div>
        </>
    );
}

export default Index;
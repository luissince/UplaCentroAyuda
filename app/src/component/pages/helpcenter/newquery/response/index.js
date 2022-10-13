import React, { useState, useRef, useEffect } from 'react';
import { getIdConsult } from '../../../../../api/rutas';
import { timeForma24 } from '../../../../../constants/tools';
import { useLocation, useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSuccess, setSuccess] = useState(false);
    const [isFetching, setFetching] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({});


    useEffect(() => {
        if (location.state == null) {
            navigate("/", {
                replace: true,
            });
            return;
        }

        loadData();

    }, []);

    const loadData = async () => {
        try {
            const response = await getIdConsult(location.state.idConsulta, location.state.token);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="app-title">
                <h1><i className="fa fa-file-text"></i> Information del Ticket <small>Centro de Ayuda</small></h1>
            </div>

            <div className="tile mb-4">
                {
                    isLoading ?
                        <div className="overlay p-5">
                            <div className="m-loader mr-4">
                                <svg className="m-circular" viewBox="25 25 50 50">
                                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                                </svg>
                            </div>
                            <h4 className="l-text text-center text-white p-10">Cargando información...</h4>
                        </div>
                        :
                        !isSuccess ?
                            <div className="overlay p-5">
                                <div className="m-loader mr-4">
                                    <svg className="m-circular" viewBox="25 25 50 50">
                                        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                                    </svg>
                                </div>
                                <h4 className="l-text text-center text-white p-10">No se pudo cargar la información.</h4>
                            </div>
                            :
                            null
                }

                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
                        <div className="form-group border-bottom">
                            <label># Ticket</label>
                            <p className="lead">#895623</p>
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                        <div className="form-group border-bottom">
                            <label>Estado</label>
                            <p className="lead"><span className="badge badge-success">Abierto</span></p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 ">
                        <div className="form-group border-bottom">
                            <label>Reportado por:</label>
                            <p className="lead">QUINTANA ORE, YANG YHONATAN</p>
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                        <div className="form-group border-bottom">
                            <label>Contacto</label>
                            <p className="lead">{isSuccess && data.contacto}</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group border-bottom">
                            <label>Fecha de creación:</label>
                            <p className="lead">{isSuccess && data.fecha + " - " + timeForma24(data.hora)}</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group border-bottom">
                            <label>Tipo:</label>
                            <p className="lead">Orientación</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group border-bottom">
                            <label>Título:</label>
                            <p className="lead">{isSuccess && data.asunto}</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group border-bottom">
                            <label>Descripción:</label>
                            <p className="lead">{isSuccess && data.descripcion}</p>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default Index;
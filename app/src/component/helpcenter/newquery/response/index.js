import { useLocation } from 'react-router-dom';

const Index = () => {

    const location = useLocation();

    console.log(location.state)

    return (
        <>
            <div className="app-title">
                <h1><i className="fa fa-file-text"></i> Information del Ticket <small>Centro de Ayuda</small></h1>
            </div>

            <div className="tile mb-4">

                <div className="overlay p-5">
                    <div className="m-loader mr-4">
                        <svg className="m-circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                        </svg>
                    </div>
                    <h4 className="l-text text-center text-white p-10">Cargando información...</h4>
                </div>

                {/* <h4 className="tile-title"><i className="fa fa-file-text"></i> Registrar tu consulta</h4> */}

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
                            <p className="lead">963852741</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group border-bottom">
                            <label>Fecha de creación:</label>
                            <p className="lead">Sep 21, 2022, 11:50 AM</p>
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
                            <p className="lead">En la malla 2019 se realiza proyección social.</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group border-bottom">
                            <label>Descripción:</label>
                            <p className="lead">Buenos días. Me pueden informar, quisiera hacer mi Proyección social y no se si en el plan 2019 se realiza.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tile mb-4">
                <div className="overlay p-5">
                    <div className="m-loader mr-4">
                        <svg className="m-circular" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                        </svg>
                    </div>
                    <h4 className="l-text text-center text-white p-10">Cargando información...</h4>
                </div>

                <h4 className="tile-title"><i className="fa fa-comment-o"></i> Consulta Creada.</h4>

                <div className="row">
                    {/* timeline item 1 left dot */}
                    <div className="col-auto text-center flex-column d-none d-sm-flex">
                        <div className="row h-50">
                            <div className="col">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                        <h5 className="m-2">
                            <span className="badge badge-pill bg-light border">&nbsp;</span>
                        </h5>
                        <div className="row h-50">
                            <div className="col border-right">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                    </div>
                    {/* timeline item 1 event content */}
                    <div className="col py-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="float-right text-muted">Mon, Jan 9th 2019 7:00 AM</div>
                                <h4 className="card-title">Day 1 Orientation</h4>
                                <p className="card-text">Welcome to the campus, introduction and get started with the tour.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-auto text-center flex-column d-none d-sm-flex">
                        <div className="row h-50">
                            <div className="col border-right">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                        <h5 className="m-2">
                            <span className="badge badge-pill bg-light border">&nbsp;</span>
                        </h5>
                        <div className="row h-50">
                            <div className="col border-right">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                    </div>
                    <div className="col py-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="float-right">Tue, Jan 10th 2019 8:30 AM</div>
                                <h4 className="card-title">Day 2 Sessions</h4>
                                <p className="card-text">Sign-up for the lessons and speakers that coincide with your course syllabus. Meet and greet with instructors.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-auto text-center flex-column d-none d-sm-flex">
                        <div className="row h-50">
                            <div className="col border-right">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                        <h5 className="m-2">
                            <span className="badge badge-pill bg-light border">&nbsp;</span>
                        </h5>
                        <div className="row h-50">
                            <div className="col border-right">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                    </div>
                    <div className="col py-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="float-right text-muted">Wed, Jan 11th 2019 8:30 AM</div>
                                <h4 className="card-title">Day 3 Sessions</h4>
                                <p>Shoreditch vegan artisan Helvetica. Tattooed Codeply Echo Park Godard kogi, next level irony ennui twee squid fap selvage. Meggings flannel Brooklyn literally small batch, mumblecore PBR try-hard kale chips. Brooklyn vinyl lumbersexual
                                    bicycle rights, viral fap cronut leggings squid chillwave pickled gentrify mustache. 3 wolf moon hashtag church-key Odd Future. Austin messenger bag normcore, Helvetica Williamsburg sartorial tote bag distillery Portland before
                                    they sold out gastropub taxidermy Vice.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-auto text-center flex-column d-none d-sm-flex">
                        <div className="row h-50">
                            <div className="col border-right">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                        <h5 className="m-2">
                            <span className="badge badge-pill bg-light border">&nbsp;</span>
                        </h5>
                        <div className="row h-50">
                            <div className="col">&nbsp;</div>
                            <div className="col">&nbsp;</div>
                        </div>
                    </div>
                    <div className="col py-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="float-right text-muted">Thu, Jan 12th 2019 11:30 AM</div>
                                <h4 className="card-title">Day 4 Wrap-up</h4>
                                <p>Join us for lunch in Bootsy's cafe across from the Campus Center.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default Index;
import React from "react";
const Welcome = () => {
    return <>
            <div className="app-title">
                <div>
                    <h1><i className="fa fa-smile-o"></i> Centro de control de indicencias</h1>
                </div>
                <ul className="app-breadcrumb breadcrumb">
                    <li className="breadcrumb-item"><i className="fa fa-home fa-lg"></i></li>
                </ul>
            </div>

            <div className="tile mb-4 pt-xl-3 pb-xl-3 pl-xl-5">
                <div className="row">
                    <div className="col-lg-12">
                        <label htmlFor="f-inicio">Bienvenido al centro de control de incidencias, donde prodra controlar y responder problemas de los alumons y/o personal administrativo.</label>
                    </div>
                </div>

            </div>    
    </>
}

export default Welcome;
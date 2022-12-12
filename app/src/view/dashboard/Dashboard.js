import React from 'react';

const Dashboard = () => {

    // const { data, isLoading, isFetching, isSuccess } = useGetDashboardQuery(undefined, {
    //     refetchOnMountOrArgChange: false,
    //     refetchOnFocus: false,
    //     refetchOnReconnect: true,
    //     // pollingInterval: 3000
    // });

    return (
        <>
            <div className="app-title">
                <h1><i className="fa fa fa-dashboard"></i> Dashboard </h1>
            </div>

            <div className="tile mb-4">

                {/* {
                    isLoading ?
                        <div className="overlay">
                            <div className="m-loader mr-4">
                                <svg className="m-circular" viewBox="25 25 50 50">
                                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10">
                                    </circle>
                                </svg>
                            </div>
                            <h4 className="l-text text-white">Cargando información...</h4>
                        </div>
                        :
                        null
                } */}

                <h4 className="tile-title"><i className="fa fa-question-circle"></i> Centro de Ayuda</h4>

                <div className="tile-body">
                    {/*  */}
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <button className="btn btn-primary"><i className="fa fa-plus"></i> Nueva consulta</button>
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <button className="btn btn-outline-warning"><i className="fa fa-lightbulb-o"></i> Pendidentes</button>
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <button className="btn btn-outline-primary"><i className="fa fa-spinner"></i> En Progreso</button>
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <button className="btn btn-outline-success"><i className="fa fa-handshake-o"></i> Resueltos</button>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                </div>
            </div>

        </>
    );
}

export default Dashboard;

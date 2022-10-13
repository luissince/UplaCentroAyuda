import axios from 'axios';

const API = process.env.REACT_APP_URL;

/**
 * 
 * @param {*} idConsulta 
 * @param {*} token 
 * @returns response
 */
export function getIdConsult(idConsulta, token) {
    return axios.get(`${API}/api/consult/${idConsulta}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

/**
 * 
 * @param {codigo,clave} user 
 * @returns promise
 */
export function getLogin(user) {
    return axios.post(`${API}/api/user/login`, {
        "codigo": user.codigo,
        "clave": user.clave
    });
}

/**
 * 
 * @param {*} consult 
 * @returns 
 */
export function addConsult(consult) {
    return axios.post("/api/consult/", {
        "asunto": consult.asunto,
        "tipoConsulta": consult.tipoConsulta,
        "contacto": consult.contacto,
        "descripcion": consult.descripcion,
        "estado": consult.estado,
        "files": consult.files,
        "c_cod_usuario": consult.idUsuario
    }, {
        headers: {
            'Authorization': `Bearer ${consult.token}`
        }
    });
}
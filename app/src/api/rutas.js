import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_URL

/**
 * 
 * @param {*} idConsulta 
 * @param {*} token 
 * @returns response
 */
export function getIdConsult(idConsulta, token, signal) {
    return axios.get(`/api/consult/id`, {
        signal: signal,
        params: {
            idConsulta: idConsulta
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

/**
 * 
 * @param {*} user 
 * @returns promise
 */
export function getLogin(user) {
    return axios.post(`/api/user/login`, user);
}

/**
 * 
 * @param {*} consult 
 * @returns 
 */
export function addConsult(consult) {
    return axios.post(`/api/consult/`, consult, {
        headers: {
            'Authorization': `Bearer ${consult.token}`
        }
    });
}

/**
 * 
 * @param {*} value // valor a filtrar 
 * @param {*} token // token de autorización
 * @returns array
 */
export async function filterStudent(value, token) {
    try {
        const response = await axios.get(`/api/student/filter/${value}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (ex) {
        return [];
    }
}

/**
 * 
 * @param {*} object 
 * @param {*} token 
 * @param {*} signal 
 * @returns 
 */
export function listConsult(object, token, signal) {
    return axios.get(`/api/consult`, {
        signal: signal,
        params: {
            posicionPagina: object.posicionPagina,
            filasPorPagina: object.filasPorPagina
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

/**
 * 
 * @param {*} consult 
 * @returns 
 */
export function sendConsulta(consult) {
    return axios.post(`/api/consult/send`, consult, {
        headers: {
            'Authorization': `Bearer ${consult.token}`
        }
    });
}

/**
 * 
 * @param {*} consult 
 * @returns 
 */
 export function validToken(token) {
    return axios.get(`/api/user/token`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
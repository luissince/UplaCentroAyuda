import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_URL

/**
 * 
 * @param {*} idConsulta 
 * @param {*} token 
 * @returns response
 */
export function getIdConsult(idConsulta, token) {
    return axios.get(`/api/consult/${idConsulta}`, {
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
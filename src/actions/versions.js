import axios from 'axios';
export const GET_VERSIONS = 'GET_VERSIONS';


export function getVersions(url='') {
    const request = axios.get(`http://127.0.0.1:4000/pagestest/versions.json`);
    return {
        type: GET_VERSIONS,
        payload: request
    };
}
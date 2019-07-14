//import config from 'config';
import { authHeader } from '../helpers/index';
import * as axios from 'axios';
import {apiUrl} from '../helpers/api-config'
//console.log(authHeader);

export const bundleService = {
    //getAll,
    getByTypeAndId,
    //getByUserAndName,
    update,
    //delete: _delete
};


function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/collections`, requestOptions).then(handleResponse);
}


function getByTypeAndId(type, id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/bundles/${type}/${id}`, requestOptions).then(handleResponse);
}

function getByUserAndName(username, name) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/collections/${username}/${name}`, requestOptions).then(handleResponse);
}

function update(bundle) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(bundle)
    };

    return fetch(`${apiUrl}/bundles/${bundle.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
/*function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    console.log(id);
    return fetch(`${apiUrl}/collections/${id}`, requestOptions).then(handleResponse);
}*/

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
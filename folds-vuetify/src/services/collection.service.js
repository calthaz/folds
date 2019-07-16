//import config from 'config';
import { authHeader } from '../helpers/index';
import * as axios from 'axios';
import {apiUrl} from '../helpers/api-config'
//console.log(authHeader);

export const collectionService = {
    getAll,
    getById,
    getByUserAndName,
    update,
    updateBg
    //delete: _delete
};


function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/collections`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/collections/${id}`, requestOptions).then(handleResponse);
}

function getByUserAndName(username, name) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/collections/${username}/${name}`, requestOptions).then(handleResponse);
}

function update(collection) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(collection)
    };

    return fetch(`${apiUrl}/collections/${collection.id}`, requestOptions).then(handleResponse);
}

function updateBg(id, prevBg, formData) {
    const url = `${apiUrl}/collections/updateBg`;
    var config = {
        headers: authHeader()
    }
    formData.append('id', id);
    formData.append('prevBg', prevBg);
    //console.log(formData);
    return axios.post(url, formData, config)
        // get data
        .then(x => x.data)
        .then(imagePath => {
            //const user = JSON.parse(localStorage.getItem('user'));
            //user.avatar = image.base64;
            //localStorage.setItem('user', JSON.stringify(user));
            return imagePath;
        }).catch(handleResponse);
        // add url field
        //.then(x => x.map(img => Object.assign({},
            //img, { url: `${BASE_URL}/images/${img.id}` })));
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
    //console.log('handle response');
    if(response.isAxiosError){
        return Promise.reject(response);
    }else{
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
}
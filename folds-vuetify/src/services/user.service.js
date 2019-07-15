//import config from 'config';
import { authHeader } from '../helpers/index';
import * as axios from 'axios';
import {apiUrl} from '../helpers/api-config'
//console.log(authHeader);

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    getByName,
    update,
    updateAvatar,
    addCollection,
    deleteCollection,
    getAllCollectionNames,
    getUsername,
    addBundle,
    deleteBundle,
    delete: _delete
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function getByName(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users/${username}`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${apiUrl}/users/${user._id}`, requestOptions).then(handleResponse)
    .then(user => {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    });
}

function updateAvatar(id, formData) {
    const url = `${apiUrl}/users/uploadAvatar`;
    var config = {
        headers: authHeader()
    }
    formData.append('id', id);
    //console.log(formData);
    return axios.post(url, formData, config)
        // get data
        .then(x => x.data)
        .then(image => {
            const user = JSON.parse(localStorage.getItem('user'));
            user.avatar = image.base64;
            localStorage.setItem('user', JSON.stringify(user));
            return image;
        })
        // add url field
        //.then(x => x.map(img => Object.assign({},
            //img, { url: `${BASE_URL}/images/${img.id}` })));
}

function getAllCollectionNames(){
    const url = `${apiUrl}/users/getCollections`;
    const user = JSON.parse(localStorage.getItem('user'));
    var config = {
        headers: authHeader()
    }
    //console.log(formData);
    return axios.post(url, {id:user._id}, config)
        // get data
        .then(x => x.data)
        .then(allCollections => {
            const user = JSON.parse(localStorage.getItem('user'));
            user.collections = allCollections;
            localStorage.setItem('user', JSON.stringify(user));
            return allCollections;
        })
}

function getUsername(){
    //const url = `${apiUrl}/users/getCollections`;
    const user = JSON.parse(localStorage.getItem('user'));
    return user.username;
}

function addCollection(id, collection){
    const url = `${apiUrl}/users/addCollection`;
    var config = {
        headers: authHeader()
    }
    //console.log(formData);
    return axios.post(url, {id, collection:{...collection}}, config)
        // get data
        .then(x => x.data)
        .then(allCollections => {
            const user = JSON.parse(localStorage.getItem('user'));
            user.collections = allCollections;
            localStorage.setItem('user', JSON.stringify(user));
            return allCollections;
        })
}

function deleteCollection(collectionId){
    //console.log('user.service');
    const url = `${apiUrl}/users/deleteCollection`;
    var config = {
        headers: authHeader()
    }
    //console.log(formData);
    return axios.post(url, {collectionId}, config)
        // get data
        .then(x => x.data)
        .then(allCollections => {
            const user = JSON.parse(localStorage.getItem('user'));
            user.collections = allCollections;
            localStorage.setItem('user', JSON.stringify(user));
            return allCollections;
        })
}

function addBundle(id, type, bundle){
    const url = `${apiUrl}/users/addBundle`;
    var config = {
        headers: authHeader()
    }
    //console.log(formData);
    return axios.post(url, {id, type, bundle:{...bundle}}, config)
        // get data
        .then(x => x.data)
        .then(allBundles => {
            const user = JSON.parse(localStorage.getItem('user'));
            if(type=="image"){
                user.imageBundles = allBundles;
            }else if(type=="text"){
                user.textBundles = allBundles;
            }
            
            localStorage.setItem('user', JSON.stringify(user));
            return allBundles;
        })
}

function deleteBundle(type, bundleId){
    console.log('user.service');
    const url = `${apiUrl}/users/deleteBundle`;
    var config = {
        headers: authHeader()
    }
    //console.log(formData);
    return axios.post(url, {type, bundleId}, config)
        // get data
        .then(x => x.data)
        .then(allBundles => {
            const user = JSON.parse(localStorage.getItem('user'));
            if(type=="image"){
                user.imageBundles = allBundles;
            }else if(type=="text"){
                user.textBundles = allBundles;
            }
            
            localStorage.setItem('user', JSON.stringify(user));
            return allBundles;
        })
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

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
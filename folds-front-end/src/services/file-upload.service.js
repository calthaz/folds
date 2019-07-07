// file-upload.service.js
//https://scotch.io/tutorials/how-to-handle-file-uploads-in-vue-2

import * as axios from 'axios';
import { authHeader } from '../helpers/index'

const BASE_URL = 'http://localhost:4000';

function upload(formData) {
    const url = `${BASE_URL}/uploads`;
    var config = {
        headers: authHeader()
    }
    return axios.post(url, formData, config)
        // get data
        .then(x => x.data)
        //TODO x.path to real url
        // add url field
        //.then(x => x.map(img => Object.assign({},
            //img, { url: `${BASE_URL}/images/${img.id}` })));
}



export { upload }
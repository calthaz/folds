// file-upload.service.js
//https://scotch.io/tutorials/how-to-handle-file-uploads-in-vue-2

import * as axios from 'axios';
import { authHeader } from '../helpers/index'

import {apiUrl} from '../helpers/api-config'

function upload(formData) {
    const url = `${apiUrl}/uploads`;
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
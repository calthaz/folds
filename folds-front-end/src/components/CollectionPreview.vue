<template>
    <div>
        <span>{{name}}</span>
        <router-link :to="'/u/'+username+'/'+name">Visit</router-link>
        <div v-if="loading" class="loading">
            Loading...
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <div v-if="collection">
            <img v-auth-img="collection.bg">
            <span>{{collection.intro}}</span>
            <a v-if="deleteFunction" href="javascript:void(0)" 
            @click="deleteFunction(collection.id)" class="text-danger">Delete</a>
        </div>
    </div>
</template>

<script>
import {collectionService} from '../services/collection.service';
import * as axios from 'axios';

function setImgSrc(el, binding) {
    const apiUrl = "http://localhost:4000"
    console.log("try to get image. at "+binding.value);
    if (binding.oldValue === undefined || binding.value !== binding.oldValue) {
    var imageUrl = apiUrl+binding.value;
    var config = {
        //headers: authHeader()
    }
    axios.get(imageUrl, {
        responseType: 'arraybuffer',
        //headers: authHeader()
    })
    .then(function(resp) {
        var mimeType = resp.headers['content-type'].toLowerCase();
        var imgBase64 = new Buffer(resp.data, 'binary').toString('base64');
        el.src = 'data:' + mimeType + ';base64,' + imgBase64;
    }).catch((function() {
        el.src = imageUrl;
    }));
    }
}

export default {
    name: 'CollectionPreview',
    props: {
        name: String,
        username: String,
        updateFunction: Function,
        deleteFunction: Function
    },
    data () {
        return {
            collection: null,
            loading: false,
            error: null
        }
    },
    directives: {
        authImg: {
            // directive definition
            bind: function(el, binding) {
                //console.log("try to get image.");
                setImgSrc(el, binding);
            },
            componentUpdated: function(el, binding) {
                //console.log("try to get image.");
                setImgSrc(el, binding);
            }
        }
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData()
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetchData'
    },
    methods: {
        fetchData () {
            this.error = this.collection = null
            this.loading = true
            // replace `getPost` with your data fetching util / API wrapper
            collectionService.getByUserAndName(this.username, this.name).then((collection) => {
                this.loading = false;
                this.collection = collection;
            }).catch(err=>{
                this.error=err;
                this.loading = false;
                console.log(err);
            })
        }
    }
}
</script>



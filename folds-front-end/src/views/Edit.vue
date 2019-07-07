<template>
    <div>
        <user-bio :fullName="account.user.fullName" :avatar="account.user.avatar" :bio="account.user.bio"></user-bio>
        <h3>Users from secure api end point:</h3>
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
        <ul v-if="users.items">
            <li v-for="user in users.items" :key="user.id">
                 <img :src="user.avatar"/>
                {{user.fullName}}
                <router-link :to="'/u/'+user.username">Visit</router-link>
            </li>
        </ul>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
        <image-upload form-title="Upload Avatar" upload-field-name = "avatar" 
        v-bind:upload-function="uploadAvatar"></image-upload>
        <h3>collections:</h3>
        <div class='collection-list'>
            <div v-for="collection in account.user.collections" :key="collection">
                {{collection}}
                <router-link :to="'/u/'+account.user.username+'/'+collection">Visit</router-link>
            </div>
        </div> 
        <collection-creator></collection-creator> 
    </div>
</template>

<script>
import ImageUpload from '../components/ImageUpload.vue'
import UserBio from '../components/UserBio.vue'
import CollectionCreator from '../components/CollectionCreator.vue'
import { mapState, mapActions } from 'vuex'
import * as axios from 'axios';
import { authHeader } from '../helpers/index'
import { userService } from '../services/user.service';


function setImgSrc(el, binding) {

    console.log("try to get image. at "+binding.value);
    if (binding.oldValue === undefined || binding.value !== binding.oldValue) {
    var imageUrl = binding.value;
    var config = {
        headers: authHeader()
    }
    axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: authHeader()
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
    components:{
        ImageUpload,
        UserBio,
        CollectionCreator
    },

    computed: {
        ...mapState({
            account: state => state.account,
            users: state => state.users.all
        }),
        
    },
    created () {
        this.getAllUsers();
    },
    methods: {
        ...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }),
        ...mapActions('account', {
            uploadAvatar: 'updateAvatar',
        })
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
    }
};
</script>
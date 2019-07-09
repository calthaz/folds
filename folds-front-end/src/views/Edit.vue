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
            <collection-preview v-for="collection in account.user.collections" :key="collection"
            :name='collection' :username='account.user.username' v-bind:deleteFunction="deleteCollection">
            </collection-preview>
        </div> 
        <collection-creator></collection-creator> 
    </div>
</template>

<script>
import ImageUpload from '../components/ImageUpload.vue'
import UserBio from '../components/UserBio.vue'
import CollectionCreator from '../components/CollectionCreator.vue'
import CollectionPreview from '../components/CollectionPreview.vue'
import { mapState, mapActions } from 'vuex'
import * as axios from 'axios';
import { authHeader } from '../helpers/index'
import { userService } from '../services/user.service';
import { collectionService } from '../services/collection.service';

export default {
    components:{
        ImageUpload,
        UserBio,
        CollectionCreator,
        CollectionPreview
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
            deleteCollection: 'deleteCollection'
        }),
        //deleteCollection: collectionService.delete //should be an account update method....
    }
};
</script>
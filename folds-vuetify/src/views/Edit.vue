<template>
    <div>
        <h1>Hi {{account.user.fullName}}!</h1>
        <img :src="account.user.avatar"/>
        <v-form ref="form" lazy-validation>
                <v-textarea
                label="Bio"
                auto-grow
                v-model="account.user.bio" @change="setDirty"
                ></v-textarea>
        </v-form>
        <p>
            <v-btn to="/login">Logout</v-btn>
        </p>
        <h3>Users from secure api end point:</h3>
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="error">ERROR: {{users.error}}</span>
        <v-list three-line v-if="users.items">
          <template v-for="user in users.items">      
            <v-list-tile :key="user.id"
              avatar :to="'/u/'+user.username">
              <v-list-tile-avatar>
                <img :src="user.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="user.fullName"></v-list-tile-title>
                <v-list-tile-sub-title v-html="user.bio"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <image-upload form-title="Upload Avatar" upload-field-name = "avatar" 
        v-bind:upload-function="uploadAvatar" :id="account.user._id"></image-upload>

        <h2>collections:</h2>
        <v-layout row wrap>
            <collection-edit v-for="collection in account.user.collections" :key="collection"
            :name='collection' :username='account.user.username' v-bind:deleteFunction="deleteCollection">
            </collection-edit>
        </v-layout> 
        <collection-creator></collection-creator> 
        <v-layout row wrap>
            <v-flex md6>
                <h2>Image Bundles:</h2>
                <v-list two-line>
                    <draggable :list="account.user.imageBundles" group="imageBundles"
                    @change='setDirty'>
                        <bundle-edit v-for="bundle in account.user.imageBundles" :key="bundle.id"
                        :bid='bundle.id' :type="'image'" v-bind:deleteFunction="deleteBundle">
                        </bundle-edit>
                    </draggable>
                </v-list> 
                <image-bundle-creator></image-bundle-creator>
            </v-flex>
            <v-flex md6>
                <h2>Text Bundles:</h2>
                <v-list two-line>
                    <draggable :list="account.user.textBundles" group="textBundles"
                    @change='setDirty'>
                        <bundle-edit v-for="bundle in account.user.textBundles" :key="bundle.id"
                        :bid='bundle.id' :type="'text'" v-bind:deleteFunction="deleteBundle">
                        </bundle-edit>
                    </draggable>
                </v-list> 
                <text-bundle-creator></text-bundle-creator> 
            </v-flex>
        </v-layout>    
        <v-fab-transition>
            <v-btn v-show="dirty" color="success"
            fab dark fixed bottom right
            @click="updateUser">
            <v-icon>save</v-icon>
            </v-btn>
        </v-fab-transition>
    </div>
</template>

<script>
import ImageUpload from '../components/ImageUpload.vue'
import UserBio from '../components/UserBio.vue'
import CollectionCreator from '../components/CollectionCreator.vue'
import CollectionEdit from '../components/CollectionEdit.vue'
import ImageBundleCreator from '../components/ImageBundleCreator.vue'
import TextBundleCreator from '../components/TextBundleCreator.vue'
import BundleEdit from '../components/BundleEdit.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import * as axios from 'axios';
import { authHeader } from '../helpers/index'
import { userService } from '../services/user.service';
import { collectionService } from '../services/collection.service';
import draggable from "vuedraggable";

export default {
    components:{
        ImageUpload,
        UserBio,
        CollectionCreator,
        CollectionEdit,
        ImageBundleCreator,
        TextBundleCreator,
        BundleEdit,
        draggable
    },
    computed: {
        ...mapState({
            account: state => state.account,
            users: state => state.users.all,
            dirty: state => state.account.status.dirty
            //collections: state => state.collections.all,
        }),
        
    },
    created () {
        this.getAllUsers();
       
    },
    methods: {
        ...mapActions('users', {
            getAllUsers: 'getAll',
            //deleteUser: 'delete'
        }),
        ...mapActions('account', {
            uploadAvatar: 'updateAvatar',
            deleteCollection: 'deleteCollection',
            deleteBundle: 'deleteBundle',
            updateUser: 'update'
        }),
        ...mapMutations('account', {setDirty: 'setDirty'}),
    }
};
</script>
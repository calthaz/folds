<template>
    <div>
        <div v-if="loading" class="loading">
        Loading...
        </div>

        <div v-if="error" class="error">
        {{ error }}
        </div>
        
        <h1> {{ $route.params.collectionName }}</h1>
        
        <div v-if='collection'>    
            <v-img :src ='$hostname+collection.bg'/>
            <image-upload form-title="Upload Background Image" upload-field-name = "bg" 
                v-bind:id="collection._id" :prev-path="collection.bg" v-bind:upload-function="uploadCollectionBg"></image-upload>
            <v-form ref="form" lazy-validation>
                <v-textarea
                label="Introduction"
                auto-grow
                v-model="collection.intro" @change="setDirty"
                ></v-textarea>
                <img v-show="status.updating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                <v-select :items="imageBundles" label="Add Image Bundle" @change="(e)=>addBundle('image', e)"></v-select>
                <v-select :items="textBundles" label="Add Text Bundle" @change="(e)=>addBundle('text', e)"></v-select>
            </v-form>
            <v-list two-line v-if="collection">
                <draggable :list="collection.bundles" group="bundles"
                    @change='setDirty'>
                    <bundle-edit v-for="bundle in collection.bundles" :key="bundle.id"
                    :bid='bundle.id' :type="bundle.type" 
                    v-bind:deleteFunction="()=>deleteBundle(bundle.type, bundle.id)">
                    </bundle-edit>
                </draggable>
            </v-list> 
        </div>
    <v-fab-transition>
        <v-btn v-show='status.dirty && !status.updating' color="success"
        fab dark fixed bottom right
        @click="updateCollection(collection)">
        <v-icon>save</v-icon>
        </v-btn>
    </v-fab-transition>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { collectionService } from '../services/collection.service'
//import CollectionHeader from '../components/CollectionHeader.vue'
import { userService } from '../services/user.service';
import BundleEdit from '../components/BundleEdit.vue'
import draggable from "vuedraggable";
import ImageUpload from '../components/ImageUpload.vue'

export default {
    components:{
        //CollectionHeader,
        BundleEdit,
        draggable,
        ImageUpload
    },
    data () {
        return {
        loading: false,
        //collection: null,
        error: null,
        //dirty: false,
        fab: false,
        }
    },
    computed: {
        ...mapState('collections', ['status']),
        collection: function () {
            const all = this.$store.state.collections.all;
            for (let c of all){
                if(c.name === this.$route.params.collectionName)
                return c;
            }
            return null;
        },
        imageBundles: function() {
            const user = this.$store.state.account.user;
            return user.imageBundles.reduce((filtered, x) => {
                //console.log(x.name);
                let shouldAdd = true;
                for (let bundle of this.collection.bundles){
                    if(bundle.type =="image" && bundle.id == x.id) shouldAdd = false;
                }
                if (shouldAdd) {
                    //var someNewValue = x.name;
                    filtered.push(`${x.title} | ${x.id}`);
                }
                return filtered;
            }, []);
        },
        textBundles: function() {
            const user = this.$store.state.account.user;
            return user.textBundles.reduce((filtered, x) => {
                //console.log(x.name);
                let shouldAdd = true;
                for (let bundle of this.collection.bundles){
                    if(bundle.type =="text" && bundle.id == x.id) shouldAdd = false;
                }
                if (shouldAdd) {
                    //var someNewValue = x.name;
                    filtered.push(`${x.title} | ${x.id}`);
                }
                return filtered;
            }, []);
        }
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        //this.fetchData();
        this.getAllCollections();
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetchData'
    },
    methods: {
        ...mapActions('collections', {
            getAllCollections: 'getAll',
            updateCollection: 'update',
            uploadCollectionBg: 'updateBg'}),
        ...mapMutations('collections', ['setDirty']),
        addBundle(type, e){
            const id = e.slice(-24);
            console.log("add " + type +" | "+ id);
            this.setDirty();
            this.collection.bundles.push({id, type});
        },
        deleteBundle(type, id){
            console.log("delete "+ type +" | "+ id);
            this.setDirty();
            this.collection.bundles = this.collection.bundles.filter(x => !(x.type===type && x.id===id));
        }
    }
}
</script>
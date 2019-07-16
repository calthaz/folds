<template>
    <div>
        <div v-if="loading" class="loading">
        Loading...
        </div>

        <div v-if="error" class="error">
        {{ error }}
        </div>
        
        <h1> {{ $route.params.bundleId }}</h1>
        
        <div v-if='bundle'>    
            <v-img :src ='$hostname+bundle.image'/>
            <image-upload form-title="Update Image" upload-field-name = "image" 
                v-bind:id="bundle._id" :prev-path="bundle.image" 
                v-bind:upload-function="uploadBundleImage"></image-upload>

            <v-form ref="form" lazy-validation>
                <v-text-field v-model="bundle.title"
                    label="Title"
                    :rules="titleRules"
                    required @change="setDirty"></v-text-field>
                <v-text-field v-model="bundle.medium"
                    label="Medium"
                    @change="setDirty"></v-text-field>
                <v-dialog
                ref="dialog" v-model="modal" return-value.sync="computedDate"
                persistent lazy full-width width="290px">
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="computedDate"
                        label="Created Date"
                        prepend-icon="event"
                        readonly v-on="on"
                        
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="computedDate" scrollable @change="setDirty">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialog.save(bundle.createdDate)">OK</v-btn>
                    </v-date-picker>
                </v-dialog>
                <v-textarea
                label="Story"
                auto-grow
                v-model="bundle.story" @change="setDirty"
                ></v-textarea>         
                <img v-show="status.updating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            </v-form>
        </div>
    <v-fab-transition>
        <v-btn v-show='status.dirty && !status.updating' color="success"
        fab dark fixed bottom right
        @click="updateBundle({type:'image', bundle})">
        <v-icon>save</v-icon>
        </v-btn>
    </v-fab-transition>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BundleEdit from '../components/BundleEdit.vue'
import draggable from "vuedraggable";
import ImageUpload from '../components/ImageUpload.vue'

export default {
    components:{
        //CollectionHeader,
        ImageUpload
    },
    data () {
        return {
        loading: false,
        //collection: null,
        error: null,
        //dirty: false,
        modal: false,
        titleRules: [v => !!v || 'Title is required.'],
        }
    },
    computed: {
        ...mapState('bundles', ['status', 'bundle']),
        computedDate: {
            get(){
                return this.bundle.createdDate.substring(0, 10);
            },
            set(value){
                this.bundle.createdDate=value+this.bundle.createdDate.substring(10);
            }
            
        }
        
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        //this.fetchData();
        this.getCurrentBundle({type:'image', id:this.$route.params.bundleId});
    },
    watch: {
        // call again the method if the route changes
        //??? params??
        '$route': 'getCurrentBundle'
    },
    methods: {
        ...mapActions('bundles', {
            getCurrentBundle: 'getByTypeAndId',
            updateBundle: 'update',
            uploadBundleImage: 'updateImage'}),
        ...mapMutations('bundles', ['setDirty']),
    }
}
</script>
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
            <p>{{bundle.title}}</p>
            <p>{{computedDate}}</p>
            <markdown-display/>         
        </div>
    <v-fab-transition>
        <v-btn v-show='status.dirty && !status.updating' color="success"
        fab dark fixed bottom right
        @click="updateBundle({type:'text', bundle})">
        <v-icon>save</v-icon>
        </v-btn>
    </v-fab-transition>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BundleEdit from '../components/BundleEdit.vue'
import draggable from "vuedraggable";
//import ImageUpload from '../components/ImageUpload.vue'
import MarkdownDisplay from '../components/MarkdownDisplay.vue'

export default {
    components:{
        //CollectionHeader,
        MarkdownDisplay
    },
    data () {
        return {
        loading: false,
        //collection: null,
        error: null,
        //dirty: false,
        //modal: false,
        //titleRules: [v => !!v || 'Title is required.'],
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
        this.getCurrentBundle({type:'text', id:this.$route.params.bundleId});
    },
    watch: {
        // call again the method if the route changes
        //??? params??
        '$route': 'getCurrentBundle'
    },
    methods: {
        ...mapActions('bundles', {
            getCurrentBundle: 'getByTypeAndId',
            updateBundle: 'update'}),
        ...mapMutations('bundles', ['setDirty']),
    }
}
</script>
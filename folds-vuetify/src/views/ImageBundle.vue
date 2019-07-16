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
            <p>{{bundle.title}}</p>
            <p>{{computedDate}}</p>
            <p>{{bundle.medium}}</p>
            <p>{{bundle.story}}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BundleEdit from '../components/BundleEdit.vue'
import draggable from "vuedraggable";

export default {
    components:{

    },
    data () {
        return {
            loading: false,
            error: null,
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
        }),
    }
}
</script>
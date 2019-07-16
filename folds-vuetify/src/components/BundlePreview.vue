<template>
<v-list-tile
    avatar :to="computedPath">
    <v-list-tile-avatar>
    <img v-if="bundle && bundle.image" :src="$hostname+bundle.image">
    </v-list-tile-avatar>
    <v-list-tile-content>
        <div v-if="loading" class="loading">
            Loading...
        </div>
        <div v-if="error" class="error">
            {{ error }}
        </div>
        <v-list-tile-title v-if="bundle" v-html="bundle.title"></v-list-tile-title>
        <v-list-tile-sub-title v-if="!bundle" v-html="bid"></v-list-tile-sub-title>
        <v-list-tile-sub-title v-if="bundle" v-html="bundle.createdDate.substr(0,10)"></v-list-tile-sub-title>
    </v-list-tile-content>
</v-list-tile>
</template>

<script>
import {bundleService} from '../services/bundle.service';
import * as axios from 'axios';
import {apiUrl} from '../helpers/api-config'


export default {
    name: 'BundleEdit',
    props: {
        bid: String,
        type: String,
        //updateFunction: Function,
        //deleteFunction: Function
    },
    data () {
        return {
            bundle: null,
            loading: false,
            error: null
        }
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData()
    },
    computed: {
        computedPath: function(){
            let type = '';
            if(this.bundle && this.bundle.image){
                type='image';
            }else if(this.bundle && this.bundle.markdown){
                type='text';
            }
            if(this.bundle)
                return `/u/${this.$route.params.username}/${this.$route.params.collectionName}/${type}/${this.bundle.id}`
            return '';

        }

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
            bundleService.getByTypeAndId(this.type, this.bid).then((bundle) => {
                this.loading = false;
                this.bundle = bundle;
            }).catch(err=>{
                this.error=err;
                this.loading = false;
                console.log(err);
            })
        }
    }
}
</script>



<template>
<v-list-tile
    avatar :to="'/editBundle/'+bid">
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
        <v-list-tile-sub-title v-if="bundle" v-html="bundle.createdDate"></v-list-tile-sub-title>
    </v-list-tile-content>
    <v-btn v-if="deleteFunction" flat color="warning" 
                @click="deleteFunction(type, bundle.id)">Delete</v-btn>
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
        updateFunction: Function,
        deleteFunction: Function
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



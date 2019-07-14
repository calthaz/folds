<template>
<v-flex md6>
    <v-card>
        <v-card-title v-if="!collection" primary-title>{{name}}</v-card-title>
        <div v-if="loading" class="loading">
            Loading...
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <v-img v-if="collection" class="white--text" 
        height="50px"
        :src="$hostname+collection.bg">
                <v-container fill-height fluid>
                    <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                        <span class="headline">{{name}}</span>
                    </v-flex>
                    </v-layout>
                </v-container>
        </v-img>
            <v-card-title v-if="collection">{{collection.intro}}</v-card-title>
            <v-card-actions v-if="collection" >
                <v-btn flat :to="'/editCollection/'+name">Visit</v-btn>
                <v-btn v-if="deleteFunction" flat color="warning" 
                @click="deleteFunction(collection.id)">Delete</v-btn>
            </v-card-actions>
    </v-card>
</v-flex>
</template>

<script>
import {collectionService} from '../services/collection.service';
import * as axios from 'axios';
import {apiUrl} from '../helpers/api-config'


export default {
    name: 'CollectionEdit',
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



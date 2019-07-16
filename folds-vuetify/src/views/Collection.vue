<template>
    <div>
        <div v-if="loading" class="loading">
        Loading...
        </div>

        <div v-if="error" class="error">
        {{ error }}
        </div>
        
        <h1> Hello {{$route.params.username}}'s {{ $route.params.collectionName }}</h1>
        <div v-if="collection">
            <collection-header :name='collection.name' :intro='collection.intro'
            :bg='collection.bg'> </collection-header>
        </div>
        <router-view/>
        <v-list two-line v-if="collection">
            <bundle-preview v-for="bundle in collection.bundles" :key="bundle.id"
            :bid='bundle.id' :type="bundle.type">
            </bundle-preview>
        </v-list> 
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { collectionService } from '../services/collection.service'
import CollectionHeader from '../components/CollectionHeader.vue'
import BundlePreview from '../components/BundlePreview.vue'

export default {
    components:{
        CollectionHeader,
        BundlePreview
    },

    data () {
    return {
      loading: false,
      collection: null,
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
            this.error = this.user = null
            this.loading = true
            // replace `getPost` with your data fetching util / API wrapper
            collectionService.getByUserAndName(
                this.$route.params.username, this.$route.params.collectionName)
                .then((collection) => {
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

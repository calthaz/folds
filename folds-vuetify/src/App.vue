<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-btn
        flat
        to="/home"
      >
        <span class="mr-2">Home</span>
      </v-btn>
      <v-btn
        flat
        to="/login"
      >
        <span class="mr-2">Login</span>
      </v-btn>
      <v-btn
        flat
        to="/login"
      >
        <span class="mr-2">Register</span>
      </v-btn>
      <v-btn
        flat
        to="/about"
      >
        <span class="mr-2">About</span>
      </v-btn>
      <v-btn
        flat
        to="/edit"
      >
        <span class="mr-2">Edit</span>
      </v-btn>
    </v-toolbar>
    <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app',
    computed: {
        ...mapState({
            alert: state => state.alert
        })
    },
    methods: {
        ...mapActions({
            clearAlert: 'alert/clear' 
        })
    },
    watch: {
        $route (to, from){
            // clear alert on location change
            this.clearAlert();
        }
    } 
};
</script>

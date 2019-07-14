<template>
    <div>
        <h2>Register</h2>
        <v-form ref="form" lazy-validation>
            <v-text-field v-model="user.fullName"
            label="Full Name"
            :rules="fullNameRules"
            required></v-text-field>
            <v-textarea
            label="Bio"
            auto-grow
            v-model="user.bio"
            ></v-textarea>
            <v-text-field v-model="user.username"
            label="Username"
            :rules="usernameRules"
            required></v-text-field>
            <v-text-field v-model="user.password" 
            label="Password"
            :rules="passwordRules"
            type="password"
            required></v-text-field>
            

            <v-btn :disabled="status.registering" @click="handleSubmit">Register</v-btn>
            <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                <v-btn to="/login" >Cancel</v-btn>
        </v-form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data () {
        return {
            user: {
                fullName: '',
                bio: '',
                username: '',
                password: ''
            },
            submitted: false,
            fullNameRules: [v => !!v || 'Name is required.'],
            usernameRules: [v => !!v || 'Username is required.'],
            passwordRules: [v => !!v || 'Password is required.',
            v => (v && v.length >= 8) || 'Password should have at least 8 characters.']
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    methods: {
        ...mapActions('account', ['register']),
        handleSubmit(e) {
            if(this.$refs.form.validate()){
                this.submitted = true;
                this.register(this.user);
            } 
        }
    }
};
</script>
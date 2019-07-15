<template>
    <div>
        <h3> create image bundle </h3>
        <v-form ref="form" lazy-validation>
            <v-text-field v-model="bundle.title"
            label="Title"
            :rules="titleRules"
            required></v-text-field>
            <v-text-field v-model="bundle.medium"
            label="Medium"></v-text-field>
            <v-textarea
            label="Story"
            auto-grow
            v-model="bundle.markdown"
            ></v-textarea>
            <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="bundle.createdDate"
                persistent
                lazy
                full-width
                width="290px"
            >
                <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="bundle.createdDate"
                    label="Created Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker v-model="bundle.createdDate" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dialog.save(bundle.createdDate)">OK</v-btn>
                </v-date-picker>
            </v-dialog>
            <v-btn :disabled="status.updating" @click="handleSubmit">Add</v-btn>
            <img v-show="status.updating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            
        </v-form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data () {
        return {
            bundle: {
                title: '',
                medium: '',
                story: '',
                createdDate:new Date().toISOString().substr(0, 10)
            },
            submitted: false,
            titleRules: [v => !!v || 'Title is required.'],
            modal: false
        }
    },
    computed: {
        ...mapState('account', ['status','user'])
    },
    methods: {
        ...mapActions('account', ['addBundle']),
        handleSubmit(e) {
            if(this.$refs.form.validate()){
                this.submitted = true;
                this.addBundle({id:this.user._id, type:'image', bundle:this.bundle});
            }
        }
    }
}
</script>

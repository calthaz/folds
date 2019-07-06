<template>
    <div>
        <h1>Hi {{account.user.firstName}}!</h1>
        <img :src="account.user.avatar"/>
        <p>You're logged in with Vue + Vuex & JWT!!</p>
        <h3>Users from secure api end point:</h3>
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
        <ul v-if="users.items">
            <li v-for="user in users.items" :key="user.id">
                 <img :src="user.avatar"/>
                {{user.firstName + ' ' + user.lastName}}
                <span v-if="user.deleting"><em> - Deleting...</em></span>
                <span v-else-if="user.deleteError" class="text-danger"> - ERROR: {{user.deleteError}}</span>
                <span v-else> - <a @click="deleteUser(user.id)" class="text-danger">Delete</a></span>
            </li>
        </ul>
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
        <form enctype="multipart/form-data" novalidate>
            <h1>Upload avatar</h1>
            <div class="dropbox">
                <input type="file" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                accept="image/*" class="input-file">
                <p v-if="isInitial">
                Drag your file(s) here to begin<br> or click to browse
                </p>
                <p v-if="isSaving">
                Uploading {{ fileCount }} files...
                </p>
            </div>
        </form>
        <!--SUCCESS-->
        <div v-if="isSuccess">
            <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
            <p>
            <a href="javascript:void(0)" @click="reset()">Upload again</a>
            </p>
            <ul class="list-unstyled">
            <li v-for="item in uploadedFiles" :key="item.url">
                <img :src="item.base64" class="img-responsive img-thumbnail" :alt="item.originalName">
            </li>
            </ul>
        </div>
        <!--FAILED-->
        <div v-if="isFailed">
            <h2>Uploaded failed.</h2>
            <p>
            <a href="javascript:void(0)" @click="reset()">Try again</a>
            </p>
            <pre>{{ uploadError }}</pre>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import * as axios from 'axios';
//import  * as temp from '../_helpers'
import { authHeader } from '../helpers/index'
import { userService } from '../services/user.service';
import { uploadAvatar } from '../services/file-upload.service';
import { userInfo } from 'os';
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

//console.log(temp);
//{__esModule: true}
//authHeader: (...)
//configureFakeBackend: (...)
//router: (...)
//console.log(authHeader);
//undefined


//axios.defaults.headers.common['Authorization'] = authHeader().Authorization;

function setImgSrc(el, binding) {

    console.log("try to get image. at "+binding.value);
    if (binding.oldValue === undefined || binding.value !== binding.oldValue) {
    var imageUrl = binding.value;
    var config = {
        headers: authHeader()
    }
    axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: authHeader()
    })
    .then(function(resp) {
        var mimeType = resp.headers['content-type'].toLowerCase();
        var imgBase64 = new Buffer(resp.data, 'binary').toString('base64');
        el.src = 'data:' + mimeType + ';base64,' + imgBase64;
    }).catch((function() {
        el.src = imageUrl;
    }));
    }
}

export default {
    data(){
        return{
            submitted: false,
            echoContent: 'Nothing posted yet.',
            //filePath:'Nothing uploaded yet.',
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'avatar'
        }
    },
    computed: {
        ...mapState({
            account: state => state.account,
            users: state => state.users.all
        }),
        isInitial() {
            return this.currentStatus === STATUS_INITIAL;
        },
        isSaving() {
            return this.currentStatus === STATUS_SAVING;
        },
        isSuccess() {
            return this.currentStatus === STATUS_SUCCESS;
        },
        isFailed() {
            return this.currentStatus === STATUS_FAILED;
        }
    },
    created () {
        this.getAllUsers();
    },
    methods: {
        ...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }),
        //--------------------------------------------------------------
        reset() {
            // reset form to initial state
            this.currentStatus = STATUS_INITIAL;
            this.uploadedFiles = [];
            this.uploadError = null;
        },
        save(formData) {
            // upload data to the server
            this.currentStatus = STATUS_SAVING;
            //console.log(this.account.user._id);
            uploadAvatar(this.account.user._id, formData).then(x => {
                //console.log(x.data);
                this.uploadedFiles.push(x);
                //console.log(this.uploadedFiles);
                this.currentStatus = STATUS_SUCCESS;
                userService.update({id:this.account.user._id, avatar: x.path});
            })
            .catch(err => {
                console.log(err);
                this.uploadError = err.response;
                this.currentStatus = STATUS_FAILED;
            });
        },
        filesChange(fieldName, fileList) {
            // handle file changes
            const formData = new FormData();

            if (!fileList.length) return;

            // append the files to FormData
            Array
            .from(Array(fileList.length).keys())
            .map(x => {
                formData.append(fieldName, fileList[x], fileList[x].name);
            });

            // save it
            this.save(formData);
        }
    },

    mounted() {
        this.reset();
    },

    directives: {
        authImg: {
            // directive definition
            bind: function(el, binding) {
                //console.log("try to get image.");
                setImgSrc(el, binding);
            },
            componentUpdated: function(el, binding) {
                //console.log("try to get image.");
                setImgSrc(el, binding);
            }
        }
    }
};
</script>

<style  scoped>
.dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
}

.input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
}

.dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
}
img{
    width: 30px 
}
</style>

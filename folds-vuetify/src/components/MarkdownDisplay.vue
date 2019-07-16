<template>
    <div id="editor">
        <div v-html="compiledMarkdown"></div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import marked from 'marked';

export default {
    props:{
        callback: Function
    },
    computed: {
        //...mapState({
            //input: state => state.bundles.bundle.markdown
        //}),
        compiledMarkdown: function () {
            console.log('break');
            let bundle = this.$store.state.bundles.bundle;
            return marked(bundle.markdown, { sanitize: true })
        }
    },
    methods: {
    }
}
</script>

<style scoped>

</style>



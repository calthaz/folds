<template>
    <div>
        {{name}}<br/>
        {{intro}}<br/>
        <img :src="$hostname+bg" >
    </div>        
</template>

<script>
export default {
    name: 'CollectionHeader',
    props: {
        name: String,
        intro: String,
        bg: String,
    },
}
</script>

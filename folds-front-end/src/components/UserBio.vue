<template>
<div>
    <h1>Hi {{fullName}}!</h1>
    <img :src="avatar"/>
    <p>{{bio}}</p>
</div>
</template>

<script>
export default {
    name: 'UserBio',
    props: {
        fullName: String,
        avatar: String,
        bio: String,
    },
}
</script>


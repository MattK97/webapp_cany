<template>
    <v-app>
        <AppBar></AppBar>
        <router-view  class="pt-12"></router-view>
    </v-app>
</template>

<script>
    import AppBar from "./components/app-bar";

    export default {
        name: 'App',
        components: {AppBar},

    };
</script>
<style>
    html {
        overflow-y: auto
    }
</style>

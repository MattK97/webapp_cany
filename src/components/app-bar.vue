<template>
    <v-app-bar app dense v-if="showBar">
        <v-tabs centered color="purple" icons-and-text>
            <v-tab router-link to="/main">
                <div>
                    <v-icon>fas fa-calendar-alt</v-icon>
                    Kalendarz
                </div>
            </v-tab>
            <v-tab router-link to="/schedule">
                <div>
                    <v-icon>fas fa-clipboard-list</v-icon>
                    Grafik
                </div>
            </v-tab>
            <v-tab router-link to="/wall">
                <div>
                    <v-icon>fas fa-comment-alt</v-icon>
                    Tablica
                </div>
            </v-tab>
            <v-tab router-link to="/employee">
                <div>
                    <v-icon>fas fa-users</v-icon>
                    Zespół
                </div>
            </v-tab>
            <v-tab router-link to="/settings">
                <div>
                    <v-icon>fas fa-cog</v-icon>
                    Ustawienia
                </div>
            </v-tab>
        </v-tabs>
        <v-tab @click="signOut">
            <div>
                <v-icon>
                    fas fa-cog
                </v-icon>
                Wyloguj
            </div>
        </v-tab>
    </v-app-bar>
</template>

<script>
    import * as firebase from "firebase/app";
    import router from "../router";
    require('firebase/auth')
    export default {
        name: "AppBar",
        methods:{
            signOut(){
                firebase.auth().signOut().then(function() {
                    console.log('Signed Out');
                    router.push({name: 'login'})
                }, function(error) {
                    console.error('Sign Out Error', error);
                });
            }
        },
        computed:{
            showBar:function () {
                return !(this.$route.path === '/login' || this.$route.path === '/register');
            }
        }
    }
</script>

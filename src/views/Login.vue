<template>
    <v-container>
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col
                            cols="12"
                            sm="8"
                            md="4"
                    >
                        <v-card class="elevation-5">
                            <v-card-text>
                                <v-form>
                                    <v-text-field
                                            id="email"
                                            label="Email"
                                            name="email"
                                            type="text"
                                            v-model="email"
                                    ></v-text-field>

                                    <v-text-field
                                            id="password"
                                            label="Password"
                                            name="password"
                                            type="password"
                                            v-model="password"
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions class="justify-center">
                                <v-btn  v-on:click="login()">Zaloguj</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
        <v-btn v-on:click="goToRegisterPage">Rejestracja</v-btn>
    </v-container>
</template>

<script>
    import router from '../router'
    import * as firebase from "firebase/app";
    require('firebase/auth');

    export default {
        name: 'Login',
        data () {
            return {
                email: '',
                password: '',
                token: '',
            }
        },
        created() {

        },
        methods: {
            login() {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(()=>{
                   router.push({name: 'main'})
                }).catch(function(error) {
                    console.log(error)
                });
            },
            goToRegisterPage(){
                router.push({name: 'register'})

            }
        }
    }
</script>

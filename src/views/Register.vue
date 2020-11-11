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
                                            id="company_name"
                                            label="Company Name"
                                            name="company_name"
                                            type="company_name"
                                            v-model="company_name"
                                    ></v-text-field>

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
                                <v-btn  v-on:click="register()">Zarejestruj</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-container>
</template>

<script>
    import router from '../router'
    import * as firebase from "firebase/app";
    require('firebase/auth');
    const axios = require('axios');
    import {ip} from '../constants'



    export default {
        name: "Register",
        data () {
            return {
                company_name:'',
                email: '',
                password: '',
                token: '',
            }
        },
        methods:{
            register(){
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((result) => {
                    console.log(result.user.uid)
                    axios.post(`${ip}/register`, {account_type: 0, company_name:this.company_name, public_id: result.user.uid})
                        .then((response) => {
                            if (response.status === 200)
                                router.push({name: 'login'})
                        })
                }).catch(function(error) {
                    // Handle Errors here.
                    console.log(error)
                    // ...
                });
            }
        }
    }
</script>

<style scoped>

</style>
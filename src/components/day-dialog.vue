<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card max-height="100%">
            <v-toolbar dark color="teal darken-3">
                <v-toolbar-title v-text="currentDay"/>
                <v-spacer/>
                <v-toolbar-items>
                    <v-btn dark text @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-row class="pt-2">
                <v-col cols="12" sm="3">
                    <v-list>
                        <v-list-item :key="item.key" v-for="item in filteredEvents"
                                     @click="displayEventDetails(item)">
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"/>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="clearEventFields">
                            <v-list-item-content>
                                <v-list-item-title>NOWY</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-divider vertical/>
                <v-col>
                    <v-card class="pa-3" elevation="0">
                        <CustomTextField
                                label="Name"
                                v-model="event.name"
                        />
                        <CustomTextArea
                                label="Opis"
                                v-model.lazy="event.info"
                                v-resize
                                rows="7"
                        />
                        <v-select
                                :items="employees"
                                v-model="event.event_employee"
                                item-text="first_name"
                                item-value="employee_id"
                                attach
                                chips
                                label="Pracownik"
                                multiple
                        />
                        <v-btn @click="eventOperation()" v-text="save"/>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>
<script>
    import CustomTextField from "./custom-text-field";
    import CustomTextArea from "./custom-text-area";
    import {ip} from "../constants";
    import {mapGetters} from "vuex";
    import * as firebase from "firebase/app";
    require('firebase/auth');

    const axios = require('axios');


    export default {
        name: "DayDialog",
        components: {CustomTextField, CustomTextArea},
        props:['dialog', 'currentDay', 'filteredEvents'],
        data() {
            return {
                save: 'ZAPISZ',
                event:{
                    event_id: 0,
                    start: '',
                    info: '',
                    name: '',
                    event_employee: []
                }
            }
        },
        computed:{
            ...mapGetters({
                employees: 'employees',
                events: 'events',
            }),
        },
        methods:{
            clearEventFields(){
                this.event={}

            },
            closeDialog(){
                this.$emit('update:dialog', false);
                this.clearEventFields();
            },
            displayEventDetails(item) {
                this.event = JSON.parse(JSON.stringify(item));
            },
            eventOperation() {
                firebase.auth().currentUser.getIdToken(true).then((idToken)=>{
                    const headers = {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': idToken
                    };
                    this.event.start = this.currentDay;
                    axios.put(`${ip}/event`, this.event, {headers: headers})
                        .then(response => {
                            if (response.status === 200) {
                                let foundIndex = this.events.findIndex(element => element.event_id === this.event.event_id);
                                this.events.splice(foundIndex, 1, this.event)
                            } else if (response.status === 201) {
                                this.event.event_id = response.data.event_id;
                                this.events.push(this.event)
                            }
                        })
                })
            },
        }
    }
</script>

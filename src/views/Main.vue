<template>
    <div class="pa-2">
        <v-row>
            <v-col>
                <v-card>
                    <v-sheet>
                        <v-toolbar flat>
                            <v-btn fab text small color="grey darken-2">
                                <v-icon small>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-toolbar-title class="text-center text-capitalize">{{ monthTitle }}</v-toolbar-title>
                            <v-btn fab text small color="grey darken-2">
                                <v-icon small>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-toolbar>
                    </v-sheet>
                    <v-sheet height="400">
                        <v-calendar
                                ref="calendar"
                                locale="pl"
                                color="teal darken-3"
                                type="month"
                                :events="events"
                                event-color="teal darken-3"
                                @click:date="openDialog"
                        >
                        </v-calendar>
                    </v-sheet>
                </v-card>
                <day-dialog
                        :dialog.sync="dialog"
                        :current-day="currentDay"
                        :filtered-events="choosedDayEvents"
                />
            </v-col>
        </v-row>
    </div>
</template>
<script>

    import DayDialog from "../components/day-dialog";
    import {mapGetters} from 'vuex'
    import {ip} from '../constants'
    import firebase from "../firebaseinit";

    const axios = require('axios');

    export default {
        name: 'Main',
        components: {DayDialog},
        data() {
            return {
                dialog: false,
                currentDay: 'dd-mm-yyyy',
                date: new Date()
            }
        },
        created() {
            firebase.auth().currentUser.getIdToken().then(token =>{
                const headers = {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': token,
                    'month': this.date.getMonth()+1
                };
                this.loadData(headers)
            });

        },
        computed: {
            ...mapGetters({
                events: 'events',
            }),
            monthTitle: function() {
                return this.date.toLocaleDateString('pl', {month: 'long'})
            },
            choosedDayEvents() {
                return this.events.filter((event) => {
                    return event.start.match(this.currentDay)
                })
            }
        },
        methods: {
            loadData(headers){
                axios.get(`${ip}/list`, {headers}).then((response) =>{
                    this.$store.commit('storeEmployees', response.data);
                    return axios.get(`${ip}/event`, {headers})
                        .then(response => {
                            this.$store.commit('storeEvents', this.dataToReadableEvents(response.data))
                        }).catch(error => {
                            console.log(error)
                        })
                }).catch(error => {
                    console.log(error)
                })
            },
            dataToReadableEvents(eventArray) {
                for (let i = 0; i < eventArray.length; i++) {
                    const value = eventArray[i];
                    value.start = value.start.substring(0, 10);
                }
                return eventArray
            },
            openDialog({date}) {
                this.currentDay = date;
                this.dialog = true
            },
        }
    }
</script>

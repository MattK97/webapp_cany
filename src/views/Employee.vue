<template>
    <div class="pa-2">
        <v-row>
            <v-col>
                <v-card height="500">
                    <v-row>
                        <v-col cols="12"
                               sm="3"
                        >
                            <v-list>
                                <v-list-item
                                        :key="item.key"
                                        @click="fetchEmployeeData(item.employee_id, current_month_number)"
                                        v-for="item in employees"
                                >
                                    <v-list-item-content>
                                        <v-list-item-title v-text="item.first_name"></v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col>
                            <v-spacer></v-spacer>
                            <div align="right">
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                color="purple"
                                                dark
                                                v-on="on"
                                                v-text="month.name"

                                        >

                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                                v-for="(item, index) in monthList"
                                                :key="index"
                                                @click="fetchEmployeeData(choosed_employee_id,item.number-1)"
                                        >
                                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                            <v-tabs>
                                <v-tab>Czas</v-tab>
                                <v-tab-item>
                                    <v-simple-table fixed-header height="300px">
                                        <template v-slot:default>
                                            <thead>
                                            <tr>
                                                <th class="text-left">START</th>
                                                <th class="text-left">STOP</th>
                                                <th class="text-left">TEGO DNIA</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="item in timestamps" :key="item">
                                                <td>{{ item.start }}</td>
                                                <td>{{ item.stop }}</td>
                                                <td>{{ item.dziennie }}</td>
                                            </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-tab-item>
                                <v-tab>Wydarzenia</v-tab>
                                <v-tab-item>
                                    <v-expansion-panels>
                                        <v-expansion-panel
                                                v-for="(item, index) in employee_events"
                                                :key="index">
                                            <v-expansion-panel-header v-text="item.name"></v-expansion-panel-header>
                                            <v-expansion-panel-content v-text="item.info"></v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-tab-item>
                                <v-tab>Grafik</v-tab>
                            </v-tabs>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {ip} from '../constants'
    import firebase from "../firebaseinit";
    const axios = require('axios');
    let moment = require('moment');
    moment().locale('pl');

    export default {
        name: 'Employee',
        data() {
            return {
                timestamps: [],
                monthList: [
                    {'name': 'Styczeń', 'number': 1},
                    {'name': 'Luty', 'number': 2},
                    {'name': 'Marzec', 'number': 3},
                    {'name': 'Kwiecień', 'number': 4},
                    {'name': 'Maj', 'number': 5},
                    {'name': 'Czerwiec', 'number': 6},
                    {'name': 'Lipiec', 'number': 7},
                    {'name': 'Sierpień', 'number': 8},
                    {'name': 'Wrzesień', 'number': 9},
                    {'name': 'Październik', 'number': 10},
                    {'name': 'Listopad', 'number': 11},
                    {'name': 'Grudzień', 'number': 12}
                ],
                current_month_number: moment().month(),
                choosed_employee_id: '',
            }
        },
        created() {
        },
        computed: {
            ...mapGetters({
                employees :'employees',
                events : 'events',
                dialog: 'dialog'
            }),

            month: function(){
                return this.monthList[this.current_month_number]
            },
            employee_events: function () {
                return this.events.filter((event) =>{
                    return event.event_employee.includes(this.choosed_employee_id)
                })
            }
        },

        methods: {
            fetchEmployeeData(employee_id, month_number) {
                firebase.auth().currentUser.getIdToken().then(idToken =>{
                    const headers = {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': idToken,
                        'employee_id': employee_id,
                        'month': month_number
                    };
                    this.choosed_employee_id = employee_id;
                    this.current_month_number = month_number;
                    let url = `${ip}/worktime`;
                    axios
                        .get(url, {headers})
                        .then(response => {
                            console.log(response.data);
                            this.timestamps = this.transformation(response.data.work_time);
                            this.events = response.data.event_list
                        })
                }).catch(error =>{
                    console.log(error)
                });
            },

            // transforms fetched data to table look-a-like strings
            transformation(dataArray) {
                for (let i = 0; i < dataArray.length; i++) {
                    const value = dataArray[i];
                    const startDate = new Date(value.start).toLocaleDateString('pl-PL', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    const stopDate = new Date(value.stop).toLocaleDateString('pl-PL', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    const total = this.totalTime(value.difference);
                    dataArray[i] = {'start': startDate, 'stop': stopDate, 'dziennie': total}
                }
                return dataArray
            },
            totalTime(s) {
                const secs = s % 60;
                s = (s - secs) / 60;
                const mins = s % 60;
                const hrs = (s - mins) / 60;
                return hrs < 0 ? '' : hrs + 'h:' + mins + 'min'
            },
        }
    }
</script>

<template>
    <v-card>
        <v-toolbar dark color="teal darken-3">
            <h3>{{ emp.name }}</h3>
            <v-spacer/>
            <v-toolbar-items>
                <v-btn dark text @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card-actions>
            <v-simple-table>
                <thead>
                <tr>
                    <th class="text-left" v-for="item in columns" :key="item.text">
                        {{ item.text }}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in emp.schedule" :key="item.locale">
                    <td>{{ item.locale }}</td>
                    <td>
                        <CustomTimePicker :value.sync="item.data.start"></CustomTimePicker>
                    </td>
                    <td>
                        <CustomTimePicker :value.sync="item.data.stop"></CustomTimePicker>
                    </td>
                    <td>
                        <v-btn outlined color="success" @click="add(item.data.start, item.data.stop, item.date)">DODAJ</v-btn>
                    </td>
                </tr>
                </tbody>
            </v-simple-table>
        </v-card-actions>
    </v-card>
</template>

<script>

import CustomTimePicker from './custom-time-picker'
import {ip} from "../constants";
let moment = require('moment');
const axios = require('axios');
    import firebase from "../firebaseinit";


export default {
    name: "ScheduleDialog",
    props: ['choosedEmployee', 'dialog-state'],
    components: {CustomTimePicker},
    data() {
        return {
            columns: [
                {text: 'DZIEN', value: 'day'},
                {text: 'START', value: 'start'},
                {text: 'STOP', value: 'stop'}
            ],
            emp: JSON.parse(JSON.stringify(this.choosedEmployee))
        }
    },
    watch:{
        choosedEmployee:function () {
            this.emp = JSON.parse(JSON.stringify(this.choosedEmployee))
        }
    },
    methods: {
        closeDialog() {
            this.$emit('update:dialog-state', false);
        },
        add(start, stop, date) {
            let datte =  moment(date, "DD.MM.YYYY").format('YYYY-MM-DD').toString(); // do zmiany bo to na szybko
            const obj =
                {
                    //schemat wysylanego obiektu
                    name: this.emp.name,
                    employee_id:this.emp.id,
                    company_id:"CL3xTzdQgrgPVdLCdIY3KesfejV2",
                    id: '1',
                    start: `${datte}, ${start}`,
                    stop: `${datte}, ${stop}`,
                    confirmed: true
                };
            this.$store.commit('addSchedule', obj);
            this.$emit('update-segregated');
            this.req(obj)
        },
        req(obj){
           firebase.auth().currentUser.getIdToken().then(token =>{      
            const headers = {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': token
            };
            axios.put(`${ip}/schedule`, obj, {headers: headers})
                .then((res) =>{
                    console.log(res)
                })
           });

        }
    },
}

/*  schemat
    name: 'Mateusz',
    id: '1',
    start: '2020-04-04 08:00:00',
    stop: '2020-04-20 20:00:00'
*/
</script>


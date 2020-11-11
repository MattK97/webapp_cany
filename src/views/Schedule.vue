<template>
    <div class="pa-2">
        <v-row>
            <v-col>
                <v-card>
                    <v-row justify="center">
                        <v-btn color="transparent" elevation="0" @click="week-=1">
                            <v-icon>fas fa-arrow-left</v-icon>
                        </v-btn>
                        <h3> {{ weeklyInterval }} </h3>
                        <v-btn color="transparent" elevation="0" @click="week+=1">
                            <v-icon>fas fa-arrow-right</v-icon>
                        </v-btn>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-sheet>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                        <tr>
                                            <th class="text-left" v-for="item in columns" :key="item.text">
                                                <v-layout justify-center>
                                                    {{item.text}}
                                                </v-layout>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr @click="openDialog(item, index)" v-for="(item, index) in segregatedData"
                                            :key="item.name">
                                            <td>
                                                <v-layout justify-center>
                                                    <v-chip color="green" class="text-left" dark>{{ item.name }}</v-chip>
                                                </v-layout>
                                            </td>
                                            <td v-for="day in item.schedule"
                                                :key="day.locale"
                                                :set="formattedString = formatString(day.data.start, day.data.stop)"
                                            >
                                                <v-layout justify-center>
                                                    {{ formattedString }}
                                                </v-layout>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
                <v-dialog
                        v-model="dialog"
                        width="500"
                >
                    <ScheduleDialog :choosedEmployee="choosedEmployee"
                                    :dialog-state.sync="dialog"
                                    @update-segregated="update"
                    />
                </v-dialog>
            </v-col>
        </v-row>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex'
    import ScheduleDialog from "../components/schedule-dialog";
    import {ip} from "../constants";
    const axios = require('axios');

    import firebase from "../firebaseinit";

    let moment = require('moment');

    export default {
        name: "Schedule",
        components: {ScheduleDialog},
        data() {
            return {
                dialog: false,
                index: 0,
                choosedEmployee: {},
                segregatedData: [],
                columns: [
                    {text: 'Imię', value: 'name'},
                    {text: 'PON', value: 'monday'},
                    {text: 'WT', value: 'tuesday'},
                    {text: 'ŚR', value: 'wednesday'},
                    {text: 'CZW', value: 'thursday'},
                    {text: 'PT', value: 'friday'},
                    {text: 'SOB', value: 'saturday'},
                    {text: 'ND', value: 'sunday'},
                ],
                week: moment().week()
            }
        },
        computed: {
            ...mapGetters({
                employees :'employees',
                schedule:'schedule'
            }),
            employeeList: function() {
                let formattedEmployeeList=[];
                this.employees.forEach(emp =>{
                    let employee = {name:'', id:''};
                    employee.name = emp.first_name + " " + emp.last_name;
                    employee.id = emp.employee_id;
                    formattedEmployeeList.push(employee)
                });
                return formattedEmployeeList
            },
            weeklyInterval: function () {
                const start = moment().week(this.week).isoWeekday(1).format('DD.MM');
                const stop = moment().week(this.week).isoWeekday(7).format('DD.MM');
                return start + ' -> ' + stop
            }
        },
        watch: {
            week: function () {
                this.clearSegregated();
                this.segregate();
            }
        },
        created() {
            this.clearSegregated();
            this.fetchData();
        },
        methods: {
            fetchData(){
                firebase.auth().currentUser.getIdToken().then(token =>{
                    const headers = {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': token,
                        'month': '6'
                    };
                    axios.get(`${ip}/schedule`,{headers: headers})
                        .then((response) =>{
                            console.log(response.data);
                            response.data.forEach(schedul =>{
                                this.$store.commit('addSchedule', schedul)
                            });
                            this.segregate()
                        });
                });
            },
            createDate(weekday) {
                return moment().week(this.week).isoWeekday(weekday).format('DD.MM.YYYY')
            },
            schema(dayName, weekDayNumber) {
                return {locale: dayName, date: this.createDate(weekDayNumber), data: {id: 0, start: '', stop: ''}}
            },
            clearSegregated() {
                this.segregatedData = [];
                this.employeeList.forEach((item) => {
                    let k = {
                        monday: this.schema('Poniedziałek', 1),
                        tuesday: this.schema('Wtorek', 2),
                        wednesday: this.schema('Środa', 3),
                        thursday: this.schema('Czwartek', 4),
                        friday: this.schema('Piatek', 5),
                        saturday: this.schema('Sobota', 6),
                        sunday: this.schema('Niedziela', 7),
                    };
                    this.segregatedData.push({name: item.name, id: item.id, schedule: k})
                });
            },
            segregate() {
                this.schedule.filter((el) => {
                    if (moment(el.start).week() !== this.week) return;
                    let foundObj = this.segregatedData.find(e => e.id === el.employee_id);
                    const startDate = new Date(el.start);
                    const stopDate = new Date(el.stop);
                    const id = el.id;
                    const day = startDate.getDay();
                    const startTime = startDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
                    const stopTime = stopDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
                    this.switchMethod(foundObj, day, startTime, stopTime, id)
                });
            },
            switchMethod(el, day, start, stop, id) {
                const scheduleInfo = {id: id, start: start, stop: stop};
                switch (day) {
                    case 0:
                        el.schedule.sunday.data = scheduleInfo;
                        break;
                    case 1:
                        el.schedule.monday.data = scheduleInfo;
                        break;
                    case 2:
                        el.schedule.tuesday.data = scheduleInfo;
                        break;
                    case 3:
                        el.schedule.wednesday.data = scheduleInfo;
                        break;
                    case 4:
                        el.schedule.thursday.data = scheduleInfo;
                        break;
                    case 5:
                        el.schedule.friday.data = scheduleInfo;
                        break;
                    case 6:
                        el.schedule.saturday.data = scheduleInfo;
                        break
                }
            },
            update() {
                this.segregate()
            },
            formatString(start, stop) {
                if (start === '') return '';
                return start + ' - ' + stop
            },
            openDialog(a, b) {
                this.choosedEmployee = a;
                this.index = b;
                this.dialog = true;
            },
        }
    }
</script>
<style>
    table th + th {
        border-left: 1px solid #dddddd;
    }

    table td + td {
        border-left: 1px solid #dddddd;
    }

    table td, th {
        width: 70px;
    }
</style>

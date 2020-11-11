import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:'',
        employees:[],
        events:[],
        schedule:[],
    },
    getters:{
        token(state){
            return state.token
        },
        employees(state){
            return state.employees
        },
        events(state){
            return state.events
        },
        schedule(state){
            return state.schedule
        },

    },
    mutations:{
        storeToken(state, token){
            state.token = token
        },
        storeEmployees(state, employees){
            state.employees = employees
        },
        storeEvents(state, events){
            state.events = events
        },
        storeSchedule(state, schedule){
            state.schedule = schedule
        },
        addSchedule(state,schedule){
            state.schedule.push(schedule)
        }

    }
});

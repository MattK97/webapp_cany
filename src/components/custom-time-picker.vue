<template>
    <v-menu offset-y max-height="200">
        <template v-slot:activator="{ on }">
            <v-btn
                    outlined
                    color="primary"
                    dark
                    v-on="on"
                    v-text="value"
            />
        </template>
        <v-list>
            <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click="choose(item)"
            >
                <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
    export default {
        name: "CustomTimePicker",
        props: ['value'],
        data(){
            return{
            }
        },
        computed:{
            items: function () {
                return [
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                ]
            },
        },
        methods:{
            choose(val){
                this.$emit('update:value', val)
            }
        }
    }
</script>


<template>
    <div>
    <v-text-field

            :label="label"
            v-bind:value="value"
            @input="debounceInput"/>
    </div>
</template>

<script>
    import * as _ from "debounce";
    export default {
        name: "customTextField",
        props: ['value', 'label'],
        methods: {
            debounceInput: _.debounce(function (e) {
                this.$emit('input', e);
                // eslint-disable-next-line no-console
                console.log(e)
            }, 500)
        }
    }
</script>

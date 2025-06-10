<template>
    
    <form class="edit-time form-inline" @submit.prevent="updateTimer()">
        <div class="input-group display-4">
            <input type="time" class="edit-time-input form-control text-center" v-model="internalTime" size=8 :id="'edit-time'+timerId" />
            <div class="input-group-append">
                <button class="btn btn-dark" type="submit">&rarr;</button>
            </div>
        </div>
    </form>

</template>

<script>
import moment from 'moment'

export default {
    name: 'EditTime',
    props: {
        time: [Object, Boolean],
        timerId: String
    },
    data() {
        return {
            internalTime: this.time ? this.time.local().format('HH:mm') : moment().local().format('HH:mm') 
        }
    },
    methods: {
      updateTimer() {
            this.$emit('update-timer', moment.utc(moment(this.internalTime, 'h:mm a')))            
      }
    }
}

</script>
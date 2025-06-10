<template>
    <div class="row justify-content-center d-flex my-3">
        <span class="lead-sm display-4">Hello, {{ timer.name }}.</span>



    </div>
  
    <div class="row justify-content-center mb-3">
        <span class="lead-sm display-4">{{ timer.userName }} set your timer for <ViewTime :time="timer.ends" /></span>

    </div>
  
    <div class="row justify-content-center mb-3">


      <div class="col-12"><span class="expired" v-if="expired">Time ran out  {{ timeLeft }}</span><span v-else>Time's up  {{ timeLeft }}</span> </div>
    </div>
  


</template>

<script>

import ViewTime from './ViewTime.vue'
import store from '../store'
// import moment from 'moment'
// import { encode, decode } from 'firebase-encode';



export default {
  name: 'Timer',
  components: {
    ViewTime,
  },
  props: {
    timer: Object,
  },
  emits: ['notifyTime'],
  data() {
    return {
      showOptions: false,
      notifyOptions: ['Notify Me with Sound', 'Notify Client with Sound', 'Notify Me Visually', 'Notify Client Visually']
    }
  },
  computed: {
    // timer() {
    //   return this.timerProp ? this.timerProp : {ends: null}
    // },
    timeLeft() {
      // Calculate difference of UTC times and return formatted
      const ends = this.timer.ends
      if (ends) {
        return ends.fromNow()
      }
      else
        return false
    },
    expired() {
      if(this.timer.ends) {
        return this.timer.ends.isBefore(store.state.theTime)
      } else
        return false
    },
  },
  created() {
    this.$watch('expired', (newVal, oldVal) => {
      if(newVal === true) {
        this.$emit('notifyTime')
      }
    })
  }
}
</script>
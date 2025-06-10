<template>

    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-lg-10 ">
        <Timer v-for="(timer,index) in timers" :timer="timer" :index="index" :id="timer.id" :key="timer.id" @update-timer="updateTimer" @destroy="destroyTimer" />
      </div>
    </div>

    <div class="row justify-content-center my-3">
      <div class="col-6">
        <button class="btn btn-warning grow" @click="showModal"><i class="bi bi-stopwatch"></i> Add a time guard</button>
      </div>
    </div>
    <div class="row justify-content-center ">
      <TimerNameModal v-show="isModalVisible" @close="closeModal" @create-timer="createTimer"  ref="newTimerName" />
    </div>

</template>

<script>
import Timer from './Timer.vue'
import TimerNameModal from './TimerNameModal.vue'
import moment from 'moment'
import firebase from 'firebase/app';
import { nextTick } from 'vue'


export default {
  name: 'Main',
  components: {
    Timer,
    TimerNameModal
  },
  data() {
    return {
        timers: [],
        addInProgress: false,
        isModalVisible: false
    }
  },
  methods: {
    createTimer(name) {

      const timer = {
        name: name,
        ends: false,
        editMode: true,
        userId: this.$store.state.user.uid,
        userName: this.$store.state.user.displayName,
      }
      firebase.database().ref('/data/timers/').push(timer).then((newTimer) => {
        timer.id = newTimer.key
        firebase.database().ref(`/data/users/${timer.userId}/timers/${timer.id}`).set(true)
        this.timers.push(timer)
        this.closeModal()
        nextTick(() => {
          document.getElementById('edit-time'+timer.id).focus()
        })
      })
    },
    getTimers() {
      this.timers = []
      try{
      firebase.database().ref('/data/users/' + this.$store.state.user.uid + '/timers').once('value').then((snapshot) => {
          if(snapshot.val()) {
            const ids = Object.keys(snapshot.val())
            for(const id of ids){
              firebase.database().ref('/data/timers/'+id).once('value').then((result) => {
                const timer = result.val()
                timer.id = id
                timer.ends = timer.ends ? moment(timer.ends) : moment()
                this.timers.push(timer);
              })
            }
          }

        })
      } catch (e) {
        console.log('No timers found')
      }
    },
    updateTimer(newTime, id) {
      const foundIndex = this.timers.findIndex(x => x.id == id);
      var updates = {}
      updates['/data/timers/'+id+'/ends'] = newTime.toJSON()
      updates['/data/timers/'+id+'/editMode'] = false
      firebase.database().ref().update(updates).then(() => {
        this.timers[foundIndex].ends = newTime
        this.timers[foundIndex].editMode = false
      })

    },
    destroyTimer(timerId, index) {
      console.log(timerId)
      firebase.database().ref('/data/timers/'+timerId+'/clients').once('value').then((snapshot) => {
        const updates = {};
        const clientIds = snapshot.val() ? Object.keys(snapshot.val()) : []
        for( var clientId of clientIds ) {
          updates['/data/clients/' + clientId + '/timers/' + timerId] = null;
        }
        firebase.database().ref().update(updates)

        firebase.database().ref('/data/users/' + this.$store.state.user.uid + '/timers/'+timerId).remove()
        firebase.database().ref('/data/timers/'+timerId).remove()
        const foundIndex = this.timers.findIndex(x => x.timerId == timerId);
        this.timers.splice(index,1)

      })
    },
    showModal() {
      this.isModalVisible = true;
      nextTick(() => {
        document.getElementById('newTimerName').focus()
      });
    },
    closeModal() {
      this.isModalVisible = false;
    }
  },
  mounted() {
    this.getTimers()

    let self = this; 

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && self.isModalVisible) {
        self.closeModal()
      }
    })
  }
}
</script>

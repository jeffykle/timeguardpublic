<template>
  <div class="client row justify-content-center">
    <div class="col">

      <ClientTimer v-if="!noResult" :timer="timer" @notifyTime="notifyTime" />

      <div v-if="noResult && notificationPermission"> This timer doesn't exist.</div>

      <div class="row justify-content-center mb-3" v-if="!notificationPermission" >
        <span class="text-warning">This app requires permission to send notifications.</span>
      </div>

      <div class="row justify-content-center mb-3" v-if="!notificationPermission" >
        <button class="btn btn-info" @click="requestNotificationPermission">Grant access</button>
      </div>

      <div class="row justify-content-center mb-3" v-if="!notificationPermission" >
        <span class="text-warning" v-if="permissionFailed">Failed to get notification permission. Check your browser settings to allow notifications. Please note: this app won't behave properly in incognito mode.</span>
      </div>

      <div class="row justify-content-center mb-3" v-if="subscribed && !noResult" >
        <button class="btn btn-danger" @click="unsub">UNSUBSCRIBE FROM NOTIFICATIONS</button>
      </div>

      <div class="row justify-content-center mb-3" v-if="!subscribed && !noResult" >
        <span class="text-warning">You are not subscribed to this timer for notifications. Refresh the page to resubscribe.</span>
      </div>

    </div>
  </div>

  <ClientAlertModal v-show="isModalVisible" @close="closeModal" :title="alertTitle" :message="alertMessage" :time="alertTime" />

</template>


<script>
import firebase from 'firebase/app';
import moment from 'moment'
import store from '../store'

// import { encode, decode } from 'firebase-encode';
import ClientTimer from '../components/ClientTimer.vue'
import ClientAlertModal from '../components/ClientAlertModal.vue'

import { messaging, getTimer, getToken, sendNotification } from '../firebase.js'

// TODO, DISCONNECT AFTER EXPIRED AND INACTIVE FOR SOME TIME, show refresh message

export default {
  name: 'Client',
  components: {
    ClientTimer,
    ClientAlertModal
  },
  data() {
    return {
      timer: {},
      permissionFailed: false,
      notificationPermission: false,
      timerRef: '/data/timers/' + this.$route.params.timerid,
      clientId: null,
      connection: null,
      isModalVisible: false,
      alertTitle: "",
      alertMessage: "",
      alertTime: "",
      subscribed: false,
    }
  },
  computed: {
    noResult() {
      return Object.keys(this.timer).length === 0 && this.timer.constructor === Object
    },
    expired() {
      // EXPECTED TO MAKE BACKGROUND BLINK WHEN TIME IS EXPIRED
      return this.timer.ends?.isBefore(store.state.theTime)
    },
  },
  created() {
    const _this = this
    this.updatePermission()
    if (this.notificationPermission) {
      this.getTimer()
    }
    messaging.onMessage((payload) => {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {body: payload.notification.body ,icon: '../assets/hourglass.png'};

      this.alertTitle = notificationTitle
      this.alertMessage = payload.notification.body
      this.alertTime = moment().local().format('hh:mm:ss A', {trim: false})
      this.isModalVisible = true
      firebase.database().ref('/data/clients/'+_this.clientId+'/lastPingReceived').set(moment().toJSON())
    });


  },
  methods:{
    getTimer() {
      const _this = this
      getTimer(this.timerRef).then(function(timer) {
        _this.timer = timer
        if(_this.noResult) {
          _this.clientId = null
          _this.notificationPermission = false
        } else {
          getToken(_this.$route.params.timerid).then((clientId) => {
            _this.clientId = clientId
            _this.subscribed = true
            firebase.database().ref(_this.timerRef+'/clients/'+clientId).set(true)
            _this.connection = setInterval(function() {
                _this.updateLastConnection(_this.clientId)
              }, 2000)
          }).catch((noPermission) => {
            _this.notificationPermission = noPermission
          })
        }
      })
    },
    requestNotificationPermission() {
      messaging.requestPermission()
      .then(() => {
        this.updatePermission()
        this.getTimer()
      })
      .catch((err)=>{
        console.log(err)
        this.permissionFailed = true
      })
    },
    updatePermission() {
      this.notificationPermission = Notification.permission === "granted"
    },
    updateLastConnection(clientId) {
      const _this = this
      firebase.database().ref(this.timerRef).once('value')
        .then(function(snapshot) {
          if(!snapshot.val()) {
            _this.timer = {}
          } else {
            firebase.database().ref('/data/clients/'+clientId+'/lastConnection').set(moment().toJSON())
            const updated = snapshot.val()
            updated.ends = snapshot.val().ends ? moment(snapshot.val().ends) : moment()
            _this.timer = updated
          } 
        })
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    unsub() {
      const _this = this
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister()
        }
        _this.subscribed = false
        clearInterval(_this.connection)
        firebase.database().ref(_this.timerRef+'/clients/'+_this.clientId).remove()
        firebase.database().ref('/data/clients/'+_this.clientId).remove()
      })

    },
    notifyTime() {
      firebase.database().ref('/data/clients/'+this.clientId+'/token').once('value', (snapshot)=> {
        if(snapshot.val()) {
          sendNotification(this.$route.params.timerid, "Time's up!", "Your TimeGuard beckons you.", [snapshot.val()])
        }
      })
    }

  },
  beforeUnmount() {
    clearInterval(this.connection)
    this.connection = null
  }
}
</script>

<style lang="scss">


.bg-blink {
  animation: bg-blinker 1.25s linear infinite;
}

@keyframes bg-blinker {
  50% {
    background-color: #808080;
  }
}

</style>
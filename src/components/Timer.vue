<template>
  <div class="jumbotron jumbotron-fluid p-3 mb-5 timer">

    <div class="row justify-content-center d-flex mt-3">
      <div class=" heading-table mx-5">
        <div class="row no-gutters justify-content-center">
            <div class="col-auto text-center text-sm-right timer-text">
              <span class="lead-sm display-3">{{ timer.name }}'s&nbsp;</span>
            </div>
            <div class="col-auto text-center text-sm-right timer-text">
              <span class="lead-sm display-3"> time is set for&nbsp;</span>
            </div>
            <div class="col-auto text-center text-sm-left pull-left">
               <span class="display-3"><ViewTime v-show="!editMode" :time="timer.ends" @edit-time="editTime" /></span>
              <EditTime v-if="editMode" :time="timer.ends" :timerId="timer.id" @update-timer="updateTimer" /> 
            </div>
        </div>
      </div>
    </div>
  
    <div class="row justify-content-center mb-1" v-if="this.timer.ends">
      <router-link :to="{ name: 'Client', params:{ userid: timer.userId, timerid: timer.id  }}">See the <strong>Client View</strong>
      </router-link>
    </div>
    <div class="row justify-content-center mb-1" v-if="!this.timer.ends">
      <span class="lead-sm" >
          Please set a time.
      </span>
    </div>
    <div class="row justify-content-center mb-1" v-if="this.timer.ends">
      <span class="lead-sm">
          <Copy :route="$router.resolve({ name: 'Client', params:{ userid: timer.userId, timerid: timer.id  }})" />
      </span>
    </div>
    <div class="row justify-content-center mb-3">
      <div class="col-12" v-if="!editMode"><span class="expired" v-if="expired">Time ran out  {{ timeLeft }}</span><span v-else>Time's up  {{ timeLeft }}</span> </div>
    </div>
    <div class="row justify-content-center mb-3 " v-if="this.timer.ends"  >
      <div class="col-12" data-toggle="tooltip" data-placement="bottom" title="Disconnected clients may still receive your ping notifications, but not timer expiration notifications.">{{ numConnectedClients }} client<span v-if="numConnectedClients!=1">s are</span><span v-else> is</span> connected. The last connection was {{ lastConnectedAt }}.<i class="material-icons help-icon">help</i></div>
    </div>
    <div class="row justify-content-center timer-buttons">

    <transition name="fade" mode="in-out">
      <div key=1 v-if="numConnectedClients > 0" class="circle shadow connected mb-3"/>
      <div key=2 v-else class="circle shadow disconnected mb-3" />
    </transition>





      <div class="col-12 col-sm-3 col-lg-2">

        <button class="btn btn-small btn-danger mb-3" @click="destroy">Destroy</button>
      </div>
      <div class="col-12 col-sm-3 col-lg-2" v-show="false">
        <button class="btn btn-small btn-dark mb-3" @click="showOptions = !showOptions" ><span v-if="!showOptions">Show</span><span v-else>Hide</span> options</button>
      </div>
      <div class="col-12 col-sm-3 col-lg-2">
        <button class="btn btn-small mb-3" :class="{'btn-dark': pingState!='none', 'btn-danger': pingState=='none'}" :disabled="pingState" @click="sendPing">Ping {{ timer.name }} <i class="material-icons" v-if="!pingState">connect_without_contact</i><i class="material-icons rotate" v-else-if="pingState=='pending'">rotate_right</i><i class="material-icons" v-else-if="pingState=='done'">done</i><i class="material-icons" v-else-if="pingState=='none'">no_accounts</i></button>
      </div>

    </div>
    <div class="row justify-content-center mt-5" v-show="showOptions">


      <div class="col form-check" v-for="option in notifyOptions" :key="option">

        <input class="form-check-input" type="checkbox" value="false" :id="option+'-option'">
        <label class="form-check-label" :for="option+'-option'">
          {{ option }}
        </label>
      </div>
        <p><pre>{{ JSON.stringify(timer, null, 2) }}</pre></p>

    </div>

  </div>
</template>

<script>

import ViewTime from './ViewTime.vue'
import EditTime from './EditTime.vue'
import Copy from './Copy.vue'
// import EditName from './EditName.vue'
import store from '../store'
import moment from 'moment'
// import { encode, decode } from 'firebase-encode';
import firebase from 'firebase/app';
import { messaging, sendNotification } from '../firebase.js'
import { nextTick } from 'vue'

export default {
  name: 'Timer',
  components: {
    ViewTime,
    EditTime,
    Copy
  },
  props: {
    timer: Object,
    index: Number //get index from v-for otherwise it can destroy the wrong ID in quick succession when deleting multiple timers
  },
  data() {
    return {
      editMode: this.timer.editMode,
      showOptions: false,
      notifyOptions: ['Notify Me with Sound', 'Notify Client with Sound', 'Notify Me Visually', 'Notify Client Visually', 'Mood: eg. grim TIME IS UP AT, cheery,  business formal,  financial, youre burning money'],
      clientIds: [],
      lastConnections: {},
      clientTokens: [],
      pingState: null
    }
  },
  computed: {
    timeLeft() {
      // Calculate difference of UTC times and return formatted
      const ends = this.timer.ends
      if (ends) {
        return ends.fromNow()
      } else
          return false
    },
    expired() {
      if(this.timer.ends) {
        return this.timer.ends.isBefore(store.state.theTime)
      } else
          return false
    },
    formattedLastConnections() {
      // for debugging only
      return Object.values(this.lastConnections).map(x => moment(x).local().format('hh:mm:ss A'))
    },
    lastConnection() {
      return Object.values(this.lastConnections).length && moment(Object.values(this.lastConnections).reduce(function (a, b) { return moment(a).isBefore(moment(b)) ? b : a; }))
    },
    lastConnectedAt() {
      return this.lastConnection ? this.lastConnection.subtract(3,'s').from(store.state.theTime) : 'unknown'
    },
    numConnectedClients() {
      return Object.values(this.lastConnections).filter(x => store.state.theTime.isBefore(moment(x).add(3,'s'))).length
    }
  },
  methods : {
    editTime() {
      this.editMode = true
      nextTick(() => {
        document.getElementById('edit-time'+this.timer.id).focus()
      })
    },
    updateTimer(newTime) {
      this.$emit('update-timer', newTime, this.timer.id)
      this.editMode = false
    },
    updateName(newName) {
      this.editMode = false
    },
    destroy() {
      console.log(this.timer.id)
      this.$emit('destroy', this.timer.id, this.index)
    },
    sendPing() {
      this.pingState = 'pending'
      const registrationIds = []
      for (var clientId of this.clientIds) {
        firebase.database().ref('/data/clients/'+clientId+'/token').once('value', (snapshot) => {
          snapshot.val() && registrationIds.push(snapshot.val())
        })
      }
      const [timerid, title, body] = [
        'Listen!',
        `${this.timer.userName} is trying to get your attention.`]
        const _this = this
        setTimeout(function() {
          sendNotification(timerid, title, body, registrationIds).then(function(result) {
            _this.pingState = result ? 'done' : 'none'
            setTimeout(function() {
              _this.pingState = null
            },2000)
          }).catch(function(err) {
            console.log('Error sending ping:', err)
          })
        },500)
    },
    getClients() {
      firebase.database().ref('/data/timers/' + this.timer.id + '/clients/')
      .once('value',  (snapshot) => {
          if(snapshot.val()) {
              this.clientIds = Object.keys(snapshot.val())
              for (var clientId of this.clientIds) {
                this.watchClient('/data/clients/'+clientId)
              }
            }
        })
    },
    watchClient(clientRef) {
      firebase.database().ref(clientRef).on('value', (snapshot) => {
        if(snapshot.val()) {
          this.lastConnections[snapshot.key] = snapshot.val()['lastConnection']
        }
      })
    }
  },
  created() {
    this.getClients()
    firebase.database().ref('/data/timers/'+this.timer.id+'/clients').on('child_added', (snapshot) => {
      this.watchClient('/data/clients/'+snapshot.key)
      this.clientIds.push(snapshot.key)
    })
  },
  unmounted() {
    for (var clientId of this.clientIds) {
      firebase.database().ref('/data/clients/'+clientId).off()
    }
  }
}
</script>

<style type="text/css">

@media (max-width: 300px) {
  td {
    display: block;
  }
}

.timer-buttons {
  position: relative;
}
 

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  60% {
    background-position: 50% 25%;
  }
  80% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }}
 
.circle {

  display: inline-block;
  border-style: solid;
  border-color: #222222;
  border-width: 1px;
  border-radius: 50%;
  min-width: 2vw;
  min-height: 2vw;
  padding: 5px;
  margin-left: 2vw;
  color: white;
  text-align: center;
  vertical-align: middle;
  line-height: .10;
  box-sizing: content-box;
  white-space: nowrap;
  position: absolute;
  bottom: 0vw;
  left: 0vw;


  
}
.circle:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  padding-top: 100%;
  height: 0;
}
.circle span {
  display: inline-block;
  vertical-align: middle;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
    opacity: 0
}



.connected {
  /*animation: connection-blinker 2s ease infinite;*/
  animation: gradient 4s ease infinite;
  background: linear-gradient(-45deg, #00E020, #196A00, #36FF00, #338637, #196A00);
  background-size: 400% 400%;
}

.disconnected {
  background: linear-gradient(-45deg, #431217, #dc3545);
}

.shadow {
  -webkit-box-shadow: 3px 3px 5px 6px #222222;  /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow:    3px 3px 5px 6px #222222;  /* Firefox 3.5 - 3.6 */
  box-shadow:         3px 3px 5px 6px #222222;  /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}


@keyframes connection-blinker {
  background: rgba(77, 150, 0, 1);
  border-radius: 45%;

}

a[target="_blank"]::after {
  content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==);
  margin: 0 3px 0 5px;
-webkit-filter: invert(100%);
        filter: invert(100%);
}

.help-icon {
  /*line-height: 0.5;*/
  font-size: .8em;
      vertical-align: top;
}


</style>
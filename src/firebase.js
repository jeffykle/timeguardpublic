import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/database'
import 'firebase/messaging'
import * as firebaseui from 'firebaseui'
import moment from 'moment'
import router from './router'

export const config = {
    apiKey: '',
    authDomain: 'timeguard.firebaseapp.com',
    databaseURL: 'https://timeguard-default-rtdb.firebaseio.com',
    projectId: 'timeguard',
    storageBucket: 'timeguard.appspot.com',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
}

firebase.initializeApp(config);
firebase.analytics();

export const authConfig = {
  signInSuccessUrl: '/',
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
      customParameters: {
        prompt: 'select_account' // always ask
      }
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],

}

export const firebaseAuth = new firebaseui.auth.AuthUI(firebase.auth())

export const updateUser = user => {
  firebase.database().ref(`/data/users/${user.uid}`).update({
    'displayName': user.displayName,
    'email': user.email,
  })
}

export const messaging = firebase.messaging();

export const getTimer = (ref) => {

  return new Promise((resolve, reject) => {
    firebase.database().ref(ref).on('value', (snapshot) => {
      if(snapshot.val()) {
        const timer = snapshot.val()
        timer.ends = timer.ends ? moment(timer.ends) : moment()
        resolve(timer)
      }
      resolve({})
    })
  })
}

export const getToken = (timerid) => {
  return new Promise((resolve, reject) => {
    messaging.getToken({vapidKey: ''})
        .then((currentToken) => {
          if (currentToken) {
            let existing = []
            // CHECK IF TOKEN ALONE ALREDY EXISTS
            const clients = firebase.database().ref(`/data/clients`)
            clients.orderByChild('token').equalTo(currentToken).limitToFirst(1).once('value').then((snapshot) => {
              if (snapshot.val()) {
                const client = Object.values(snapshot.val())[0]
                if (currentToken === client.token) {
                  //DON'T CREATE A NEW CLIENT
                  //GET TIMERS
                  const clientId = Object.keys(snapshot.val())[0]
                  console.log('Client is already recognized', Object.keys(snapshot.val())[0])
                  firebase.database().ref(`/data/clients/${clientId}/timers/${timerid}`).set(true)
                  resolve(clientId)
                }
              } else {
                //Create a new client record
                const now = moment().toJSON()
                const clientData = {'token': currentToken, firstConnection: now, lastConnection: now, timers: {}, lastPingReceived: now}
                clientData.timers[timerid] = true
                const newClient = clients.push(clientData)
                resolve(newClient.key)
              }
            })
          } else {
            console.log('No registration token available. Request permission to generate one.')
            reject(false)
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          reject(false)
        });
  })
}
      

export const sendNotification = (timerid, title, body, registrationIds) => {
  var key = '';
  var route = { name: 'Client', params: { timerid: timerid } }

    var notification = {
      'title': title,
      'body': body,
      'icon': 'hourglass.png',
      'click_action': window.location.origin + '/' + router.resolve(route).href
    }
    var payload = {
      'notification': notification,
    }
    if(registrationIds.length == 1) {
      payload['to'] = registrationIds[0]
    } else if( registrationIds.length > 1){
      payload['registration_ids'] = registrationIds
    }
    return new Promise((resolve, reject) => {

      if (registrationIds.length) {
        fetch('https://fcm.googleapis.com/fcm/send', {
          'method': 'POST',
          'headers': {
            'Authorization': 'key=' + key,
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify(payload)
        }).then(function(response) {
          resolve(true)
        }).catch(function(error) {
          console.error('sendNotification error', error);
          reject(false)
        })

      }
      else {
        console.log('This timer has no registered clients.')
        resolve(false)

      }

    })
}

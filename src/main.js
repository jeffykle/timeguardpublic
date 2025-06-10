import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import firebase from 'firebase/app'
import { firebaseAuth, authConfig, messaging, updateUser } from './firebase.js'



createApp(App)
  .use(store)
  .use(router)
  .mount("#app");

setInterval(function() {
    store.commit('getTime')
},1000)


$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        store.commit('setUser', user)
        updateUser(user)
    }
    else {
        store.commit('setUser', null)
        router.push('/')
    }
});

document.getElementById('#firebaseui-container') && firebaseAuth.start('#firebaseui-container', authConfig)

/**********************************/
/*     _____ ___  ____   ___      */
/*    |_   _/ _ \|  _ \ / _ \     */
/*      | || | | | | | | | | |    */
/*      | || |_| | |_| | |_| |    */
/*      |_| \___/|____/ \___/     */
/*                                */
/**********************************/

// Fix database security rules

// Client link opens root page instead of client page



<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <div class="row justify-content-center">
                    <div class="col-12 col-sm-4 order-sm-6">
                        <div class="row justify-content-center mb-1">
                            <router-link to="/">
                              <transition name="expand" mode="out-in">
                                <img alt="TimeGuard logo" src="@/assets/timeguard-light.png" class="main-logo" :class="{'small-logo': $route.fullPath != '/'}" />
                              </transition>
                            </router-link>

                        </div>
                        <div class="row justify-content-center mb-4" :class="{'small-brand': $route.name != 'Home'}">
                          <h1 class="display-3 brand" ><span v-if="$route.name == 'About'" class="d-inline" >About </span><router-link to="/">TimeGuard</router-link></h1>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4 text-center order-sm-12">
                        <Clock />
                            <p>
                                <router-link :to="{ name: 'About' }">About</router-link>
                            </p>
                    </div>
                    <div class="col-12 col-sm-4 text-center order-sm-1" id="menu">
                        <div v-if="$route.name != 'Client'" >



                            <button v-if="!user && !loginVisible" @click="toggleLoginForm" 
                            class="btn btn-light">Log in</button>

                            <a v-if="!user && loginVisible" class="btn btn-link"  @click="toggleLoginForm" >Cancel log in</a>
                            <transition name="fade" mode="in-out">
                              <div v-show="loginVisible" id="firebaseui-container"></div>
                            </transition>
                            <p>
                                <router-link :to="{ name: 'Profile' }"  v-if="user">{{ user.displayName }}</router-link>
                            </p>
                            <p>
                                <button v-if="user" class="btn btn-dark" @click="logout" 
                                >Log out</button>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>

            <router-view />
    </div>
</template>

<script>
import firebase from 'firebase/app'
import { firebaseAuth, authConfig, messaging } from './firebase.js'

import Clock from "@/components/Clock.vue";

export default {
  name: 'App',
  components: {
    Clock
  },
  data() {
    return {
      loginVisible: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    toggleLoginForm() {
    if(document.getElementsByClassName('firebaseui-page-provider-sign-in').length == 0){
      firebaseAuth.start('#firebaseui-container', authConfig)      
    }
      this.loginVisible = !this.loginVisible
    },
    logout() {
      firebase.auth().signOut()
    },
  },
}

</script>

<style lang="scss">
@import './assets/index.css';


#menu {

  a {
    font-weight: bold;

    &.router-link-exact-active {
      color: #FFFFFF;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

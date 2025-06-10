<template>


      <!-- Check that the SDK client is not currently loading before accessing is methods -->
      <div v-if="!$auth.loading">
        <!-- show login when not authenticated -->
        <a v-if="!$auth.isAuthenticated" @click="login" class="button is-dark"><strong>Sign in</strong></a>
        <!-- show logout when authenticated -->
        <a v-if="$auth.isAuthenticated" @click="logout" class="button is-dark"><strong>Log out</strong></a>
      </div>

      

    <div class="row justify-content-center my-3">
      <div class="col-12">
      </div>
      <div class="col-12">
        <button class="btn btn-light grow" @click="return">Login</button>
      </div>
      <div class="col-12 my-3">
        What's this<i class="bi bi-question"></i>
      </div>
    </div>

</template>

<script>
export default {
  name: 'Auth',
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>
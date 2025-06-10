<template>


    <Main v-if="isAuthenticated"/>
    <p v-else> Please log in to manage your time guards.</p>




</template>

<script>
import Main from '../components/Main.vue'

export default {
  name: 'App',
  components: {
    Main,
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.user
    }
  },
}
</script>
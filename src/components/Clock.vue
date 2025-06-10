<template>
    
<p class="clock">{{ clock }}</p>

</template>

<script>

import store from '@/store'


export default {
    name: 'Clock',
    computed: {
      clock() {
        if(store.state.theTime) {
          return store.state.theTime.local().format('hh:mm:ss A', {trim: false})
        }
        return '--:-- --'
      }
    }
}

</script>
<template>
    
    <span class="view-time" @click="editTime">{{ displayTime }} <i v-if="$route.fullPath == '/'" class="bi bi-pencil-fill"></i></span>

</template>

<script>

export default {
    name: 'ViewTime',
    props: {
        time: [Object, Boolean]
    },
    computed: {
        displayTime() {
            if (this.time) {
                return this.time.local().format('hh:mm A', {trim: false})
            } else
                return '--:-- --'
        }
    },
    methods: {
      editTime() {
        this.$emit('edit-time')
      }
    }
}

</script>
<template>
    
    <form class="edit-name form-inline" @submit.prevent="updateName()">
        <div class="input-group display-4">
            <input type="text" class="edit-name-input form-control text-center" v-model="name" size=8 />
            <div class="input-group-append">
                <button class="btn btn-dark" type="submit">&rarr;</button>
            </div>
        </div>
    </form>

</template>

<script>


export default {
    name: 'EditName',
    props: {
        time: String
    },
    methods: {
      updateName() {
        this.$emit('update-name', this.time)
      }
    }
}

</script>
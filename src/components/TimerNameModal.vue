<script>
  export default {
    name: 'modal',
    data() {
      return {
        name: "",
        errors: []
      }
    },
    methods: {
      close() {
        this.$emit('close');
        this.name = ""
        this.errors = []
      },
      createTimer() {
        if (this.name.length > 20) {
          this.errors.push({id: this.errors.length, text: 'Name is too long (max 20 characters).'})
          return
        }
        this.$emit('create-timer', this.name)
        this.name = ""
        this.errors = []
        
      }
    },
  };
</script>

<template>


  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click="close">
        <div class="modal-container w-50"  @click.stop>
          <div class="row justify-content-around">

            <div class="col-10">
            </div>
            <div class="col-2">
              <button class="btn btn-warn modal-default-button" @click="close"><i class="material-icons">clear</i></button>
            </div>

          </div>
          <div class="row justify-content-center">


              <form class="form w-50" @submit.prevent="createTimer()">
                <div class="row justify-content-center mb-3" v-for="error in errors" :key="error.id">
                    <span class="text-danger">  {{ error.text }}</span>
                </div>
                <div class="row justify-content-center mb-3">
                  <input type="text" id
                  ="newTimerName" class="form-control text-center lead" placeholder="Enter a name" required v-model="name" />
                </div>
                <div class="row justify-content-center mb-3">
                  <button type="submit" class="btn btn-dark modal-default-button">
                  Create this Time Guard
                  </button>
                </div>

              </form>



          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>.modal-mask {

  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 1s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #CACACA;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border-radius: 25px ;
}
input {
    width: 400px;
    padding: 0 20px;
}

input,
input::-webkit-input-placeholder {
    font-size: 20px;
    line-height: 3;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container, .modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
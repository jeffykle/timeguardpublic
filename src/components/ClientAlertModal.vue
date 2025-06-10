<script>
  export default {
    name: 'modal',
    props: {
      title: String,
      message: String,
      time: String
    },
    methods: {
      close() {
        this.$emit('close');
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
        <div class="modal-container p-4"  @click.stop>
          <div class="row justify-content-around">

            <div class="col-10">
            </div>
            <div class="col-2">
              <button class="btn btn-warn modal-default-button" @click="close"><i class="material-icons">clear</i></button>
            </div>

          </div>


                <div class="row justify-content-center mb-3">
                  <p class="display-3 text-dark">{{ title }}</p>
                </div>
                <div class="row justify-content-center mb-3">
                  <p class="display-3 text-dark">{{ message }}</p>
                </div>
                <div class="row justify-content-center mb-3">
                  <p class="strong text-dark">Sent at {{ time }}</p>
                </div>

                <div class="row justify-content-center mb-3">
                  <button @click="close" class="btn btn-dark modal-default-button mb-4">
                  OK
                  </button>
                </div>




        </div>
      </div>
    </div>
  </transition>
</template>

<style>

p {
  color: #222222;
}


.modal-mask {

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
  max-width: 80vw;
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
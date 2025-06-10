<template lang="html">
  <button @click="copy" class="btn btn-link">Copy client link <i class="material-icons">content_copy</i></button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useClipboard from 'vue-clipboard3'

export default defineComponent({
  props: {
    route: Object
  },
  setup(props) {
    const { toClipboard } = useClipboard()

    const copy = async () => {
      try {
        await toClipboard(window.location.origin + '/#' + props.route.fullPath)
        console.log('Copied to clipboard')
      } catch (e) {
        console.error(e)
      }
    }

    return { copy }
  }
})
</script>
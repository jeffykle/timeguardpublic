<template>
  <div class="profile row justify-content-center">
    <div class="col">
    <h2>Your User Info</h2>

      <img :src="$store.state.user.photoURL" class="img img-responsive mb-3">
      <h3 class="mb-3">{{ $store.state.user.displayName }}</h3>
      <p class="mb-3">{{ $store.state.user.email }}</p>
      <!-- <p>Phone number: {{ $store.state.user.phoneNumber ? $store.state.user.phoneNumber : 'Not found' }}</p> -->
<!--   <p><pre>{{ JSON.stringify($store.state.user, null, 2) }}</pre></p>
 -->


  </div>
  </div>
</template>


<script>

export default {
  name: 'Profile',
}
</script>

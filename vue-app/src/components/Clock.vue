<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const time = ref(new Date().toLocaleTimeString())
let timer: number

// runs after the component appears on screen
onMounted(() => {
  console.log('Clock mounted')
  timer = window.setInterval(() => (time.value = new Date().toLocaleTimeString()), 1000)
})

// runs when it is removed: clean up timers and listeners here
onUnmounted(() => {
  console.log('Clock unmounted')
  clearInterval(timer)
})
</script>

<template>
  <p class="text-2xl font-mono">{{ time }}</p>
</template>

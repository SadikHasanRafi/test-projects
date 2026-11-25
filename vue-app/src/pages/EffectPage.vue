<script setup lang="ts">
// LESSON 7: Watchers and lifecycle (side effects)
// "When something changes, DO something" (save, log, fetch, set timer)
// Open the browser console to see the logs.
import { onMounted, ref, watch, watchEffect } from 'vue'
import Clock from '../components/Clock.vue'
import DemoCard from '../components/DemoCard.vue'

const count = ref(0)
const log = ref('')
const name = ref(localStorage.getItem('name') ?? '')
const showClock = ref(true)

// [1] Run once, after the component is on screen
onMounted(() => console.log('EffectPage mounted'))

// [2] watch: runs when `count` changes, gives new and old value
watch(count, (newValue, oldValue) => {
  log.value = `count went from ${oldValue} to ${newValue}`
})
// options: { immediate: true } runs at start too, { deep: true } watches inside objects

// [3] watchEffect: runs now, and again whenever anything it reads changes
watchEffect(() => {
  localStorage.setItem('name', name.value)
})

// [4] watchEffect that touches the DOM-level API
watchEffect(() => {
  document.title = `Count: ${count.value}`
})
</script>

<template>
  <DemoCard title="[2] Watch a value / [4] check the tab title">
    <button class="btn" @click="count++">count: {{ count }}</button>
    <p>{{ log || 'click the button' }}</p>
  </DemoCard>

  <DemoCard title="[3] Auto-save to localStorage">
    <input v-model="name" class="input" placeholder="type, then refresh the page" />
  </DemoCard>

  <DemoCard title="[5] Mount / unmount a child">
    <button class="btn" @click="showClock = !showClock">
      {{ showClock ? 'Remove clock' : 'Add clock' }}
    </button>
    <Clock v-if="showClock" />
  </DemoCard>
</template>

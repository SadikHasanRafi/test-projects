<script setup lang="ts">
// LESSON 10: Composables (reusable logic)
import DemoCard from '../components/DemoCard.vue'
import { useCounter } from '../composables/useCounter'
import { useWindowWidth } from '../composables/useWindowWidth'

// each call gets its OWN state
const { count: a, increment: incrementA, reset: resetA } = useCounter()
const { count: b, increment: incrementB } = useCounter(100)

const width = useWindowWidth()
</script>

<template>
  <DemoCard title="[1] useCounter used twice">
    <div class="flex gap-2">
      <button class="btn" @click="incrementA">A: {{ a }}</button>
      <button class="btn" @click="resetA">Reset A</button>
      <button class="btn" @click="incrementB">B: {{ b }}</button>
    </div>
  </DemoCard>

  <DemoCard title="[2] useWindowWidth">
    <p>Resize the window: {{ width }}px</p>
  </DemoCard>
</template>

<script setup lang="ts">
// LESSON 9: Getting a real DOM element
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'
import DemoCard from '../components/DemoCard.vue'

// the string must match ref="..." in the template
const inputEl = useTemplateRef<HTMLInputElement>('myInput')
const boxEl = useTemplateRef<HTMLDivElement>('myBox')

const messages = ref<string[]>(['first message'])

// [1] The element exists only after mount
onMounted(() => inputEl.value?.focus())

// [2] The DOM updates a moment after state changes; nextTick waits for it
async function addMessage() {
  messages.value.push(`message ${messages.value.length + 1}`)
  await nextTick()
  boxEl.value?.scrollTo({ top: boxEl.value.scrollHeight })
}
</script>

<template>
  <DemoCard title="[1] Focus an input">
    <input ref="myInput" class="input" placeholder="auto focused" />
    <button class="btn ml-2" @click="inputEl?.focus()">Focus</button>
  </DemoCard>

  <DemoCard title="[2] Scroll to the newest item">
    <div ref="myBox" class="h-28 overflow-y-auto rounded border border-slate-300 p-2">
      <p v-for="m in messages" :key="m">{{ m }}</p>
    </div>
    <button class="btn" @click="addMessage">Add message</button>
  </DemoCard>
</template>

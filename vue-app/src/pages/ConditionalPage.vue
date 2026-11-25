<script setup lang="ts">
// LESSON 3: Conditional rendering
import { ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'

const isLoggedIn = ref(false)
const score = ref(50)
const showBox = ref(true)
const items = ref<string[]>([])
</script>

<template>
  <DemoCard title="[1] if / else: v-if, v-else">
    <p v-if="isLoggedIn" class="text-emerald-600">Welcome back!</p>
    <p v-else class="text-red-600">Please log in.</p>
    <button class="btn" @click="isLoggedIn = !isLoggedIn">
      <!-- [2] ternary inside {{ }} -->
      {{ isLoggedIn ? 'Log out' : 'Log in' }}
    </button>
  </DemoCard>

  <DemoCard title="[3] else-if chain">
    <input v-model.number="score" type="range" min="0" max="100" />
    <p>Score: {{ score }}</p>
    <p v-if="score >= 80">Grade: A</p>
    <p v-else-if="score >= 50">Grade: B</p>
    <p v-else>Grade: Fail</p>
  </DemoCard>

  <DemoCard title="[4] Show only when true">
    <p v-if="score === 100">Perfect score! 🎉</p>
    <p v-else class="text-slate-400">(drag to 100)</p>

    <!-- <template> groups several elements without adding an extra div -->
    <template v-if="items.length === 0">
      <p>No items yet.</p>
      <button class="btn" @click="items.push('item')">Add one</button>
    </template>
    <template v-else>
      <p>You have {{ items.length }} item(s).</p>
      <button class="btn" @click="items = []">Clear</button>
    </template>
  </DemoCard>

  <DemoCard title="[5] Hide with CSS: v-show">
    <button class="btn" @click="showBox = !showBox">Toggle</button>
    <!-- v-if removes the element from the DOM. v-show only sets display:none -->
    <div v-show="showBox" class="rounded bg-amber-100 p-3">
      My typed text survives hiding: <input class="input" />
    </div>
  </DemoCard>
</template>

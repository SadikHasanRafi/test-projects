<script setup lang="ts">
// LESSON 6: Computed (derived) values
// A value calculated FROM state. Don't store it as another state.
import { computed, ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'

const firstName = ref('John')
const lastName = ref('Doe')

// [1] Re-calculated only when firstName or lastName changes. Cached otherwise.
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// [2] Search filter
const search = ref('')
const languages = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust']

// Dependencies are detected automatically
const results = computed(() =>
  languages.filter((l) => l.toLowerCase().includes(search.value.toLowerCase())),
)

// [3] Writable computed (get + set)
const celsius = ref(25)
const fahrenheit = computed({
  get: () => (celsius.value * 9) / 5 + 32,
  set: (value: number) => {
    celsius.value = ((value - 32) * 5) / 9
  },
})
</script>

<template>
  <DemoCard title="[1] Full name">
    <input v-model="firstName" class="input mr-2" />
    <input v-model="lastName" class="input" />
    <p>Full name: <b>{{ fullName }}</b></p>
  </DemoCard>

  <DemoCard title="[2] Search">
    <input v-model="search" class="input" placeholder="search language" />
    <p>{{ results.length }} found: {{ results.join(', ') }}</p>
  </DemoCard>

  <DemoCard title="[3] Two-way conversion">
    <label>°C <input v-model.number="celsius" type="number" class="input" /></label>
    <label>°F <input v-model.number="fahrenheit" type="number" class="input" /></label>
  </DemoCard>
</template>

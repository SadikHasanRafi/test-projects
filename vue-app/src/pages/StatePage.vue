<script setup lang="ts">
// LESSON 2: State and events
//
// The flow:  click button -> function runs -> state changes -> screen updates
//
// This <script setup> runs ONCE, when the component is created.
// After that Vue tracks which parts of the template use which state,
// and updates only those parts.
import { reactive, ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'

// [1] ref() creates state. In <script> use .value, in <template> don't.
const count = ref(0)

function increment() {
  count.value++ // just change it, Vue notices
}

function decrement() {
  count.value--
}

// [2] Passing an argument to the handler
function add(amount: number) {
  count.value += amount
}

// [3] Adding three times in a row
function addThree() {
  count.value++
  count.value++
  count.value++ // +3, because each line reads the latest value
}

// [4] reactive() is for objects: no .value needed
const user = reactive({ name: 'Sam', age: 20 })

function birthday() {
  user.age++ // mutate the property directly
}

// [5] Arrays: normal mutating methods work
const fruits = ref(['apple', 'banana'])

function addFruit() {
  fruits.value.push(`mango ${fruits.value.length}`)
}

function removeFirst() {
  fruits.value.shift()
}

// [6] The event object
const lastKey = ref('')

function onKeydown(event: KeyboardEvent) {
  lastKey.value = event.key
}
</script>

<template>
  <DemoCard title="[1] Counter">
    <p class="text-4xl font-bold">{{ count }}</p>
    <div class="flex gap-2">
      <!-- "@click" is short for v-on:click -->
      <button class="btn" @click="decrement">-1</button>
      <button class="btn" @click="increment">+1</button>
      <!-- tiny logic can be written inline (no .value in the template) -->
      <button class="btn" @click="count = 0">Reset</button>
    </div>
  </DemoCard>

  <DemoCard title="[2] Handler with an argument / [3] many updates">
    <div class="flex gap-2">
      <button class="btn" @click="add(10)">+10</button>
      <button class="btn" @click="addThree">+3</button>
    </div>
  </DemoCard>

  <DemoCard title="[4] Object state">
    <p>{{ user.name }} is {{ user.age }}</p>
    <button class="btn" @click="birthday">Birthday</button>
  </DemoCard>

  <DemoCard title="[5] Array state">
    <p>{{ fruits.join(', ') }}</p>
    <div class="flex gap-2">
      <button class="btn" @click="addFruit">Add</button>
      <button class="btn" @click="removeFirst">Remove first</button>
    </div>
  </DemoCard>

  <DemoCard title="[6] Event object">
    <input class="input" placeholder="press any key" @keydown="onKeydown" />
    <p>Last key: {{ lastKey }}</p>
    <!-- Event modifiers: .enter, .prevent, .stop and more -->
    <input class="input" placeholder="press Enter to +1" @keyup.enter="increment" />
  </DemoCard>
</template>

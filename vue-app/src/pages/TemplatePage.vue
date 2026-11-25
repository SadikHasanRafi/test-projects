<script setup lang="ts">
// LESSON 1: Showing data in the markup
// A .vue file has <script> (logic) and <template> (HTML + Vue directives).
// Everything declared in <script setup> is usable in the template.
import DemoCard from '../components/DemoCard.vue'

const name = 'Vue'
const price = 25
const link = 'https://vuejs.org'
const isActive = true
const textColor = 'tomato'
const inputProps = { placeholder: 'spread attributes', maxlength: 10 }
const htmlText = '<strong>bold from a string</strong>'
</script>

<template>
  <DemoCard title="[1] Print a value: {{ }}">
    <p>Hello {{ name }}!</p>
    <p>Any JS expression works: {{ price * 2 }} / {{ name.toUpperCase() }}</p>
  </DemoCard>

  <DemoCard title="[2] Dynamic attribute: :href">
    <!-- ":" is short for v-bind. Without it, "link" would be plain text -->
    <a :href="link" target="_blank" class="text-blue-600 underline">Vue docs</a>
  </DemoCard>

  <DemoCard title="[3] Dynamic class and style">
    <!-- static class + dynamic :class can live together -->
    <p class="rounded p-2" :class="{ 'bg-emerald-200': isActive, 'opacity-50': !isActive }">
      class chosen by a condition
    </p>
    <p :style="{ color: textColor, fontSize: '20px' }">inline style object</p>
  </DemoCard>

  <DemoCard title="[4] Many attributes at once: v-bind">
    <input v-bind="inputProps" class="input" />
  </DemoCard>

  <DemoCard title="[5] Raw HTML: v-html">
    <!-- {{ }} escapes HTML. v-html does not, so NEVER use it with user input (XSS) -->
    <p>{{ htmlText }}</p>
    <p v-html="htmlText"></p>
  </DemoCard>
</template>

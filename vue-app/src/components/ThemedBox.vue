<script setup lang="ts">
// A deeply nested child. No props needed: it injects the value directly.
import { inject } from 'vue'
import { themeKey } from '../theme'

const { theme, toggle } = inject(themeKey)!
</script>

<template>
  <div class="rounded-lg p-4" :class="theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-amber-100'">
    <p>Theme from the parent: {{ theme }}</p>
    <button class="btn mt-2 border border-white" @click="toggle">Toggle theme</button>
  </div>
</template>

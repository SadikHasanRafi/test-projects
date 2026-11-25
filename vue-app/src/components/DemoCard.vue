<script setup lang="ts">
// Used by every lesson page. `title` is a prop, <slot /> is whatever you put inside.
defineProps<{ title: string }>()
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 class="mb-3 font-semibold">{{ title }}</h2>
    <div class="space-y-3">
      <slot />
    </div>
  </section>
</template>

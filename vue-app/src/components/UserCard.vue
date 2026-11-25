<script setup lang="ts">
// PROPS: data coming IN from the parent (read only)
// Destructuring with "= value" sets a default
const { name, role = 'member' } = defineProps<{ name: string; role?: string }>()

// EMITS: events going OUT to the parent
const emit = defineEmits<{
  greet: [message: string]
}>()
</script>

<template>
  <div class="rounded-lg border border-slate-200 p-3">
    <p><b>{{ name }}</b> ({{ role }})</p>
    <button class="btn mt-2" @click="emit('greet', `Hello from ${name}`)">Greet parent</button>
  </div>
</template>

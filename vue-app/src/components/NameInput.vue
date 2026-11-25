<script setup lang="ts">
// defineModel() lets the parent use v-model on this component.
// Changing model.value here changes the parent's state.
const model = defineModel<string>({ required: true })
</script>

<template>
  <input v-model="model" class="input" placeholder="typing inside the child" />
</template>

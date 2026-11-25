<script setup lang="ts">
// URL parameter: /routing/users/:id
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { users } from '../../data'

// comes from the URL because the route has props: true
// (without it: useRoute().params.id). It is always a string.
const props = defineProps<{ id: string }>()

const user = computed(() => users.find((u) => u.id === Number(props.id)))
</script>

<template>
  <p v-if="user">User #{{ user.id }}: <b>{{ user.name }}</b></p>
  <p v-else>No user with id {{ id }}</p>
  <RouterLink to="/routing/users" class="text-blue-600 underline">← all users</RouterLink>
</template>

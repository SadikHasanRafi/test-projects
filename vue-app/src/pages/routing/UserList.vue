<script setup lang="ts">
// Query string: /routing/users?q=ri
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { users } from '../../data'

const route = useRoute()
const router = useRouter()

// the URL is the state: read from it, write to it
const search = computed({
  get: () => String(route.query.q ?? ''),
  // replace = don't add a history entry on every key press
  set: (q) => router.replace({ query: q ? { q } : {} }),
})

const filtered = computed(() =>
  users.filter((u) => u.name.toLowerCase().includes(search.value.toLowerCase())),
)
</script>

<template>
  <div class="space-y-2">
    <input v-model="search" class="input" placeholder="search (watch the URL)" />
    <p v-for="user in filtered" :key="user.id">
      <RouterLink :to="`/routing/users/${user.id}`" class="text-blue-600 underline">
        {{ user.name }}
      </RouterLink>
    </p>
  </div>
</template>

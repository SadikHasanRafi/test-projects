<script setup lang="ts">
// LESSON 12: API calls
// Free fake API: https://jsonplaceholder.typicode.com
import { ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'
import { useFetch } from '../composables/useFetch'

const API = 'https://jsonplaceholder.typicode.com'
type Post = { id: number; title: string }

// [1] GET that re-runs when userId changes
const userId = ref(1)
const { data: posts, loading, error, refetch } = useFetch<Post[]>(
  () => `${API}/posts?userId=${userId.value}&_limit=3`,
)

// [2] A broken URL, to see the error state
const { error: brokenError, loading: brokenLoading } = useFetch(`${API}/wrong-url`)

// [3] POST when a form is submitted
const title = ref('')
const saving = ref(false)
const created = ref<Post | null>(null)
const saveError = ref('')

async function createPost() {
  saving.value = true
  saveError.value = ''
  try {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, userId: 1 }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    created.value = await res.json()
    title.value = ''
  } catch (e) {
    saveError.value = (e as Error).message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <DemoCard title="[1] GET with loading and error">
    <div class="flex gap-2">
      <button v-for="n in 3" :key="n" class="btn" :disabled="userId === n" @click="userId = n">
        User {{ n }}
      </button>
      <button class="btn" @click="refetch">Reload</button>
    </div>
    <p v-if="loading" class="animate-pulse">Loading...</p>
    <p v-else-if="error" class="text-red-600">Error: {{ error }}</p>
    <ul v-else class="list-disc pl-5">
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </DemoCard>

  <DemoCard title="[2] Error state (broken URL)">
    <p v-if="brokenLoading">Loading...</p>
    <p v-else class="text-red-600">Error: {{ brokenError }}</p>
  </DemoCard>

  <DemoCard title="[3] POST">
    <form class="flex gap-2" @submit.prevent="createPost">
      <input v-model="title" class="input" placeholder="post title" required />
      <button class="btn" :disabled="saving">{{ saving ? 'Saving...' : 'Create' }}</button>
    </form>
    <p v-if="saveError" class="text-red-600">{{ saveError }}</p>
    <!-- this fake API answers like a real one but saves nothing -->
    <p v-if="created">Server returned id {{ created.id }}: {{ created.title }}</p>
  </DemoCard>
</template>

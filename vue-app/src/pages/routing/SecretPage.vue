<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/routing')
}
</script>

<template>
  <p class="mb-2">🔐 Secret page. Logged in as {{ auth.user }}.</p>
  <button class="btn" @click="logout">Log out</button>
</template>

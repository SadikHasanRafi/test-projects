<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

function login() {
  auth.login('Demo user')
  // go back to the page the guard blocked
  router.replace(String(route.query.redirect ?? '/routing'))
}
</script>

<template>
  <p class="mb-2">You need to log in to see that page.</p>
  <button class="btn" @click="login">Fake login</button>
</template>

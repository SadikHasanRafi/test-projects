<script setup lang="ts">
// LESSON 13: Routing. All routes are defined in src/router.ts
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import DemoCard from '../../components/DemoCard.vue'

const route = useRoute() // READ the current URL
const router = useRouter() // CHANGE the URL from code
</script>

<template>
  <DemoCard title="[1] Links and nested routes">
    <nav class="flex flex-wrap gap-4 text-blue-600 underline">
      <RouterLink to="/routing" exact-active-class="font-bold">Home</RouterLink>
      <RouterLink to="/routing/users" active-class="font-bold">Users</RouterLink>
      <RouterLink to="/routing/secret" active-class="font-bold">Secret (protected)</RouterLink>
      <RouterLink to="/nothing-here">Broken link (404)</RouterLink>
    </nav>
    <p class="text-sm text-slate-500">Current path: {{ route.fullPath }}</p>
  </DemoCard>

  <DemoCard title="[2] Child route renders here">
    <RouterView />
  </DemoCard>

  <DemoCard title="[3] Navigate from code">
    <div class="flex gap-2">
      <button class="btn" @click="router.push({ name: 'user', params: { id: 2 } })">Go to user 2</button>
      <button class="btn" @click="router.back()">Back</button>
    </div>
  </DemoCard>
</template>

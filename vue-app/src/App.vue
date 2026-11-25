<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { lessons } from './lessons'
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 md:flex">
    <aside class="bg-white p-4 md:w-64 md:shrink-0 md:border-r md:border-slate-200">
      <h1 class="mb-4 text-xl font-bold text-emerald-600">Vue Lessons</h1>
      <nav class="flex flex-wrap gap-1 md:flex-col">
        <!-- RouterLink changes the page without reloading. active-class styles the current one -->
        <RouterLink
          v-for="lesson in lessons"
          :key="lesson.path"
          :to="lesson.path"
          class="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100"
          active-class="bg-emerald-100 font-semibold text-emerald-800"
        >
          {{ lesson.title }}
        </RouterLink>
      </nav>
    </aside>

    <main class="max-w-3xl flex-1 space-y-4 p-4 md:p-8">
      <!-- The matched route's component is rendered here -->
      <RouterView />
    </main>
  </div>
</template>

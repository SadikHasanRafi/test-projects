<script setup lang="ts">
// LESSON 14: Everything together
// state, events, v-model, v-for, v-if, computed, watch
import { computed, ref, watch } from 'vue'
import DemoCard from '../components/DemoCard.vue'

type Todo = { id: number; text: string; done: boolean }
type Filter = 'all' | 'active' | 'done'

const todos = ref<Todo[]>(JSON.parse(localStorage.getItem('todos') ?? '[]'))
const text = ref('')
const filter = ref<Filter>('all')
const filters: Filter[] = ['all', 'active', 'done']

const visible = computed(() =>
  todos.value.filter((t) => filter.value === 'all' || t.done === (filter.value === 'done')),
)
const remaining = computed(() => todos.value.filter((t) => !t.done).length)

// deep: true -> also react to changes inside the array (like todo.done)
watch(todos, (value) => localStorage.setItem('todos', JSON.stringify(value)), { deep: true })

function addTodo() {
  if (!text.value.trim()) return
  todos.value.push({ id: Date.now(), text: text.value.trim(), done: false })
  text.value = ''
}

function removeTodo(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id)
}
</script>

<template>
  <DemoCard title="Todo list">
    <form class="flex gap-2" @submit.prevent="addTodo">
      <input v-model="text" class="input flex-1" placeholder="What to do?" />
      <button class="btn">Add</button>
    </form>

    <div class="flex gap-2">
      <button v-for="f in filters" :key="f" class="btn" :disabled="filter === f" @click="filter = f">
        {{ f }}
      </button>
    </div>

    <p v-if="visible.length === 0" class="text-slate-400">Nothing here.</p>
    <ul v-else class="divide-y divide-slate-200">
      <li v-for="todo in visible" :key="todo.id" class="flex items-center gap-2 py-2">
        <input v-model="todo.done" type="checkbox" />
        <span class="flex-1" :class="{ 'text-slate-400 line-through': todo.done }">{{ todo.text }}</span>
        <button class="btn" @click="removeTodo(todo.id)">✕</button>
      </li>
    </ul>

    <p class="text-sm text-slate-500">{{ remaining }} remaining</p>
  </DemoCard>
</template>

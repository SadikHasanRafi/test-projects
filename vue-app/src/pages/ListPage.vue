<script setup lang="ts">
// LESSON 4: Rendering lists
import { computed, ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'

const products = ref([
  { id: 1, name: 'Keyboard', price: 40, inStock: true },
  { id: 2, name: 'Mouse', price: 15, inStock: false },
  { id: 3, name: 'Monitor', price: 180, inStock: true },
])

const specs = { brand: 'Acme', warranty: '1 year' }

const available = computed(() => products.value.filter((p) => p.inStock))

function shuffle() {
  products.value.reverse() // mutating is fine in Vue
}

function remove(id: number) {
  products.value = products.value.filter((p) => p.id !== id)
}
</script>

<template>
  <DemoCard title="[1] Loop with v-for (and :key)">
    <ul class="divide-y divide-slate-200">
      <!-- :key must be unique and stable (use an id, not the index) -->
      <li v-for="(product, index) in products" :key="product.id" class="flex justify-between py-2">
        <span :class="{ 'text-slate-400 line-through': !product.inStock }">
          {{ index + 1 }}. {{ product.name }} - ${{ product.price }}
        </span>
        <button class="btn" @click="remove(product.id)">Delete</button>
      </li>
    </ul>
    <p v-if="products.length === 0">List is empty.</p>
    <button class="btn" @click="shuffle">Reverse order</button>
  </DemoCard>

  <DemoCard title="[2] Filtered list">
    <!-- don't put v-if and v-for on one element; filter with computed instead -->
    <p v-for="product in available" :key="product.id">{{ product.name }}</p>
  </DemoCard>

  <DemoCard title="[3] Loop over an object">
    <p v-for="(value, key) in specs" :key="key">{{ key }}: {{ value }}</p>
  </DemoCard>

  <DemoCard title="[4] Loop a number of times">
    <!-- starts at 1 -->
    <span v-for="n in 5" :key="n" class="mr-2">⭐{{ n }}</span>
  </DemoCard>
</template>

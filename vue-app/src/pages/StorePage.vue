<script setup lang="ts">
// LESSON 11: Sharing state without passing props through every level
//   provide / inject -> for a subtree
//   Pinia store      -> for the whole app
import { provide, ref } from 'vue'
import CartBadge from '../components/CartBadge.vue'
import DemoCard from '../components/DemoCard.vue'
import ThemedBox from '../components/ThemedBox.vue'
import { useCartStore } from '../stores/cart'
import { themeKey } from '../theme'

// [1] provide to all descendants
const theme = ref('light')
const toggle = () => (theme.value = theme.value === 'light' ? 'dark' : 'light')
provide(themeKey, { theme, toggle })

// [2] use the global store
const cart = useCartStore()
</script>

<template>
  <DemoCard title="[1] provide / inject">
    <ThemedBox />
  </DemoCard>

  <DemoCard title="[2] Pinia store (go to another page and come back: it stays)">
    <div class="flex gap-2">
      <button class="btn" @click="cart.add('apple')">Add apple</button>
      <button class="btn" @click="cart.add('book')">Add book</button>
      <button class="btn" @click="cart.clear()">Clear</button>
    </div>
    <CartBadge />
  </DemoCard>
</template>

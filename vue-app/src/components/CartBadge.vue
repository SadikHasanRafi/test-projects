<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
</script>

<template>
  <p>🛒 {{ cart.total }} item(s): {{ cart.items.join(', ') }}</p>
</template>

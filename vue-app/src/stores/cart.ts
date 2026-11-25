import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref<string[]>([])
  const total = computed(() => items.value.length)

  function add(item: string) {
    items.value.push(item)
  }
  function clear() {
    items.value = []
  }

  return { items, total, add, clear }
})

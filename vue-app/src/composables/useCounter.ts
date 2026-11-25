import { ref } from 'vue'

// A composable = a function starting with "use" that holds reusable stateful logic
export function useCounter(start = 0) {
  const count = ref(start)
  const increment = () => count.value++
  const reset = () => (count.value = start)
  return { count, increment, reset }
}

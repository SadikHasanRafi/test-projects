import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// PINIA store: global state that any component (or the router) can use
export const useAuthStore = defineStore('auth', () => {
  const user = ref<string | null>(null) // state
  const isLoggedIn = computed(() => user.value !== null) // getter

  function login(name: string) {
    user.value = name // action
  }
  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})

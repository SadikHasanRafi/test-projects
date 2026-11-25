import { create } from 'zustand'

// ZUSTAND store: global state that any component can use (popular library)
type AuthState = {
  user: string | null
  login: (name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // state
  login: (name) => set({ user: name }), // actions
  logout: () => set({ user: null }),
}))

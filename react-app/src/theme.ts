import { createContext } from 'react'

// The Context shared by the provider and the consumer
export const ThemeContext = createContext<{ theme: string; toggle: () => void } | null>(null)

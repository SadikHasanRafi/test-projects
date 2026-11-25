import type { InjectionKey, Ref } from 'vue'

// A typed key shared by provide() and inject()
export const themeKey: InjectionKey<{ theme: Ref<string>; toggle: () => void }> = Symbol('theme')

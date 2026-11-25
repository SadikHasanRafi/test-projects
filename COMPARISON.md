# Vue vs React: syntax comparison

- [0. The one big difference](#0-the-one-big-difference)
- [Cheat sheet](#cheat-sheet)
- [1. Template vs JSX](#1-template-vs-jsx) · [2. State and events](#2-state-and-events) · [3. Conditional rendering](#3-conditional-rendering) · [4. Lists](#4-lists)
- [5. Forms](#5-forms) · [6. Computed values](#6-computed-values) · [7. Watchers, effects, lifecycle](#7-watchers-effects-lifecycle) · [8. Components](#8-components)
- [9. DOM refs](#9-dom-refs) · [10. Composables and hooks](#10-composables-and-hooks) · [11. Shared state](#11-shared-state) · [12. API calls](#12-api-calls)
- [13. Routing](#13-routing) · [14. Tailwind](#14-tailwind) · [Common mistakes](#common-mistakes)

## 0. The one big difference

Both do this:

```
click button  →  function runs  →  state changes  →  screen updates
```

The difference is **how the framework finds out** that state changed.

| | Vue | React |
| --- | --- | --- |
| How you change state | `count.value++` | `setCount(count + 1)` |
| How it notices | the `ref` tracks reads and writes | you called the setter |
| What runs again | only the affected part of the screen; `<script setup>` runs **once** | the **whole component function** |
| Changing objects/arrays | mutate: `list.push(x)` | replace: `setList([...list, x])` |

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)        // 1. create state

function increment() {      // 3. runs on click
  count.value++             // 4. change state
}
</script>

<template>
  <p>{{ count }}</p>                          <!-- 5. screen shows the new value -->
  <button @click="increment">+1</button>      <!-- 2. bind function to button -->
</template>
```

### React

```tsx
import { useState } from 'react'

export default function Counter() {           // runs again on every change
  const [count, setCount] = useState(0)       // 1. create state

  function increment() {                      // 3. runs on click
    setCount(count + 1)                       // 4. ask for new state
  }

  return (
    <>
      <p>{count}</p>                          {/* 5. screen shows the new value */}
      <button onClick={increment}>+1</button> {/* 2. bind function to button */}
    </>
  )
}
```

**Why `count++` does not work in React:** `count` is a normal constant. Changing it tells React nothing, so nothing re-renders. Only `setCount` does.

## Cheat sheet

| Task | Vue | React |
| --- | --- | --- |
| File | `.vue` (script + template) | `.tsx` (function returning JSX) |
| Print a value | `{{ name }}` | `{name}` |
| Dynamic attribute | `:href="url"` | `href={url}` |
| CSS class | `class` + `:class` | `className` |
| Click | `@click="save"` | `onClick={save}` |
| Click with argument | `@click="add(5)"` | `onClick={() => add(5)}` |
| State | `ref()`, `reactive()` | `useState()` |
| If | `v-if` / `v-else-if` / `v-else` | `? :`, `&&`, early `return` |
| Hide | `v-show` | toggle a `hidden` class |
| Loop | `v-for` + `:key` | `.map()` + `key` |
| Input binding | `v-model` | `value` + `onChange` |
| Derived value | `computed()` | plain variable / `useMemo()` |
| React to change | `watch()`, `watchEffect()` | `useEffect()` |
| On mount | `onMounted()` | `useEffect(fn, [])` |
| Cleanup | `onUnmounted()` | function returned by the effect |
| Props | `defineProps()` | function arguments |
| Child → parent | `defineEmits()` | callback prop |
| Pass markup | `<slot />` | `children` |
| DOM element | `useTemplateRef()` | `useRef()` |
| Reusable logic | composable `useX()` | custom hook `useX()` |
| Pass deep | `provide` / `inject` | Context |
| Global store | Pinia | Zustand (or Redux Toolkit) |
| Link | `<RouterLink to>` | `<Link to>` / `<NavLink to>` |
| Child route slot | `<RouterView />` | `<Outlet />` |

## 1. Template vs JSX

| | Vue | React |
| --- | --- | --- |
| Expression | `{{ price * 2 }}` | `{price * 2}` |
| Attribute | `<a :href="link">` | `<a href={link}>` |
| Conditional class | `:class="{ active: isActive }"` | `className={isActive ? 'active' : ''}` |
| Style | `:style="{ color: c }"` | `style={{ color: c }}` |
| Spread | `v-bind="props"` | `{...props}` |
| Raw HTML | `v-html="html"` | `dangerouslySetInnerHTML={{ __html: html }}` |
| Many root elements | allowed | wrap in `<>...</>` |
| Comment | `<!-- text -->` | `{/* text */}` |

## 2. State and events

**Vue**

```ts
const count = ref(0)
count.value++                       // .value in script, not in template

const user = reactive({ age: 20 })
user.age++                          // no .value

const list = ref<string[]>([])
list.value.push('a')                // mutate
```

**React**

```ts
const [count, setCount] = useState(0)
setCount((c) => c + 1)              // function form: based on the latest value

const [user, setUser] = useState({ age: 20 })
setUser({ ...user, age: user.age + 1 })   // new object

const [list, setList] = useState<string[]>([])
setList([...list, 'a'])             // new array
```

React state is a **snapshot** for the current render:

```ts
// count is 0
setCount(count + 1)
setCount(count + 1)
console.log(count)       // still 0
// after re-render: 1, not 2
```

Events:

| | Vue | React |
| --- | --- | --- |
| Prevent reload | `@submit.prevent="save"` | `e.preventDefault()` |
| Enter key | `@keyup.enter="save"` | `if (e.key === 'Enter') save()` |
| Stop bubbling | `@click.stop="x"` | `e.stopPropagation()` |
| Typing | `@input` | `onChange` (fires on every key) |

## 3. Conditional rendering

**Vue**: directives

```vue
<p v-if="score >= 80">A</p>
<p v-else-if="score >= 50">B</p>
<p v-else>Fail</p>

<div v-show="open">stays in the DOM</div>
```

**React**: plain JavaScript

```tsx
{isLoggedIn ? <p>Welcome</p> : <p>Please log in</p>}

{score === 100 && <p>Perfect!</p>}

function Grade({ score }: { score: number }) {
  if (score >= 80) return <p>A</p>
  if (score >= 50) return <p>B</p>
  return <p>Fail</p>
}

<div className={open ? '' : 'hidden'}>stays in the DOM</div>
```

## 4. Lists

```vue
<li v-for="(item, index) in items" :key="item.id">{{ item.name }}</li>
<p v-for="(value, key) in object" :key="key">{{ key }}: {{ value }}</p>
<span v-for="n in 5" :key="n">{{ n }}</span>
```

```tsx
{items.map((item, index) => <li key={item.id}>{item.name}</li>)}
{Object.entries(object).map(([key, value]) => <p key={key}>{key}: {value}</p>)}
{Array.from({ length: 5 }, (_, i) => i + 1).map((n) => <span key={n}>{n}</span>)}
```

## 5. Forms

| Input | Vue | React |
| --- | --- | --- |
| Text | `v-model="name"` | `value={name} onChange={(e) => setName(e.target.value)}` |
| Number | `v-model.number="age"` | `onChange={(e) => setAge(Number(e.target.value))}` |
| Trim | `v-model.trim="name"` | `name.trim()` |
| Checkbox | `v-model="agree"` | `checked={agree} onChange={(e) => setAgree(e.target.checked)}` |
| Checkbox group | `v-model="skills" value="vue"` | add/remove from the array yourself |
| Radio | `v-model="gender" value="male"` | `checked={gender === 'male'}` |
| Select | `v-model="country"` | `value={country} onChange={...}` |
| Reset an object | `Object.assign(form, emptyForm())` | `setForm(emptyForm)` |

## 6. Computed values

```ts
// Vue: cached, dependencies found automatically
const fullName = computed(() => `${first.value} ${last.value}`)
```

```ts
// React: just calculate it during render
const fullName = `${first} ${last}`

// only for expensive work; you list the dependencies
const results = useMemo(() => bigFilter(items, search), [items, search])
```

With the React Compiler enabled, `useMemo` is mostly unnecessary. This project does not enable it.

## 7. Watchers, effects, lifecycle

| When | Vue | React |
| --- | --- | --- |
| After mount | `onMounted(fn)` | `useEffect(fn, [])` |
| Before removal | `onUnmounted(fn)` | `useEffect(() => cleanup, [])` |
| `x` changes | `watch(x, (now, old) => {})` | `useEffect(fn, [x])` (also runs on mount, no old value) |
| Anything used changes | `watchEffect(fn)` | no equivalent: list the dependencies |
| Every update | `onUpdated(fn)` | `useEffect(fn)` |

```ts
// Vue
onMounted(() => { timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
```

```ts
// React: setup and cleanup together
useEffect(() => {
  const timer = setInterval(tick, 1000)
  return () => clearInterval(timer)
}, [])
```

In development, React `StrictMode` runs effects twice on purpose, so you see some logs twice.

## 8. Components

**Props and events**

```vue
<!-- child -->
<script setup lang="ts">
const { name, role = 'member' } = defineProps<{ name: string; role?: string }>()
const emit = defineEmits<{ greet: [message: string] }>()
</script>
<template>
  <button @click="emit('greet', 'Hello')">{{ name }}</button>
</template>

<!-- parent -->
<UserCard name="Rina" @greet="handleGreet" />
```

```tsx
// child
type Props = { name: string; role?: string; onGreet: (message: string) => void }

function UserCard({ name, role = 'member', onGreet }: Props) {
  return <button onClick={() => onGreet('Hello')}>{name}</button>
}

// parent
<UserCard name="Rina" onGreet={handleGreet} />
```

**Slots vs children**

```vue
<!-- child -->
<header><slot name="header">Default</slot></header>
<slot />

<!-- parent -->
<Panel>
  <template #header>Title</template>
  Body
</Panel>
```

```tsx
// child
function Panel({ header = 'Default', children }: Props) {
  return <><header>{header}</header>{children}</>
}

// parent
<Panel header="Title">Body</Panel>
```

**Two-way binding with a child**

```ts
// Vue child                       // parent: <NameInput v-model="username" />
const model = defineModel<string>({ required: true })
```

```tsx
// React child                     // parent: <NameInput value={username} onChange={setUsername} />
<input value={value} onChange={(e) => onChange(e.target.value)} />
```

## 9. DOM refs

```vue
<script setup lang="ts">
const input = useTemplateRef<HTMLInputElement>('myInput')
onMounted(() => input.value?.focus())
</script>
<template><input ref="myInput" /></template>
```

```tsx
const input = useRef<HTMLInputElement>(null)
useEffect(() => input.current?.focus(), [])
return <input ref={input} />
```

The word `ref` means different things: in Vue, `ref()` is **state**. In React, `useRef()` is a box that **does not** re-render when changed.

Need the DOM after a state change? Vue: `await nextTick()`. React: `useEffect(fn, [thatState])`.

## 10. Composables and hooks

```ts
// Vue
export function useCounter(start = 0) {
  const count = ref(start)
  const increment = () => count.value++
  return { count, increment }
}
```

```ts
// React
export function useCounter(start = 0) {
  const [count, setCount] = useState(start)
  const increment = () => setCount((c) => c + 1)
  return { count, increment }
}
```

React hooks must be called at the top level of a component or hook, never inside `if` or loops.

## 11. Shared state

**Subtree: provide/inject vs Context**

```ts
// Vue
provide(themeKey, { theme, toggle })          // parent
const { theme, toggle } = inject(themeKey)!   // any descendant
```

```tsx
// React
const ThemeContext = createContext(null)
<ThemeContext value={{ theme, toggle }}>...</ThemeContext>   // parent
const { theme, toggle } = useContext(ThemeContext)!          // any descendant
```

**Whole app: Pinia vs Zustand**

```ts
// Pinia
export const useCartStore = defineStore('cart', () => {
  const items = ref<string[]>([])
  const add = (item: string) => items.value.push(item)
  return { items, add }
})

const cart = useCartStore()
cart.add('apple')
```

```ts
// Zustand
export const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}))

const items = useCartStore((s) => s.items)
const add = useCartStore((s) => s.add)
add('apple')
```

## 12. API calls

Both use the browser's `fetch`. You always handle three states: **loading, error, data**.

```ts
// Vue: re-runs when something read before the first await changes
watchEffect(async (onCleanup) => {
  const url = `/posts?userId=${userId.value}`
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  // fetch, then set data / error / loading
})
```

```ts
// React: re-runs when a listed dependency changes
useEffect(() => {
  const controller = new AbortController()
  async function load() { /* fetch, then setState */ }
  load()
  return () => controller.abort()
}, [userId])
```

- `fetch` does **not** throw on 404 or 500. Check `res.ok`.
- Abort old requests, or a slow old response can overwrite a new one.
- Send data (POST) from an event handler, not from an effect.
- Full code: [useFetch.ts (Vue)](vue-app/src/composables/useFetch.ts), [useFetch.ts (React)](react-app/src/hooks/useFetch.ts).
- In real projects, look at TanStack Query, which supports both.

## 13. Routing

**Defining routes**

```ts
// Vue: a config array
createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/users', component: Users },
    { path: '/users/:id', component: UserDetail, props: true },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
})
```

```tsx
// React: JSX
<Routes>
  <Route path="/users" element={<Users />} />
  <Route path="/users/:id" element={<UserDetail />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

React Router also has a config-object style (`createBrowserRouter`) that you will see in other projects.

| Task | Vue Router | React Router |
| --- | --- | --- |
| Link | `<RouterLink to="/users">` | `<Link to="/users">` |
| Active style | `active-class="..."` | `<NavLink className={({ isActive }) => ...}>` |
| Child route appears in | `<RouterView />` | `<Outlet />` |
| Go from code | `router.push('/users')` | `navigate('/users')` |
| Replace history | `router.replace(...)` | `navigate(..., { replace: true })` |
| Back | `router.back()` | `navigate(-1)` |
| URL param | `route.params.id` or a prop | `const { id } = useParams()` |
| Query string | `route.query.q` | `searchParams.get('q')` |
| Current path | `useRoute().fullPath` | `useLocation().pathname` |
| Lazy page | `() => import('./Page.vue')` | `lazy(() => import('./Page'))` + `<Suspense>` |
| Guard | `router.beforeEach()` | a wrapper component with `<Navigate>` |

Guards here are only for the user experience. Real security must be checked on the server.

## 14. Tailwind

Tailwind is the **same** in both. Only the attribute name differs (`class` vs `className`).

Setup (Tailwind 4):

1. `pnpm add -D tailwindcss @tailwindcss/vite`
2. Add `tailwindcss()` to the plugins in `vite.config.ts`.
3. Put `@import "tailwindcss";` in your CSS file.

| Class | Meaning |
| --- | --- |
| `p-4`, `px-3`, `mt-2` | padding, horizontal padding, top margin |
| `flex`, `flex-col`, `gap-2` | flexbox, column, spacing |
| `space-y-4` | vertical space between children |
| `text-sm`, `font-bold`, `text-red-600` | size, weight, color |
| `bg-white`, `rounded-xl`, `border`, `shadow-sm` | box style |
| `hover:`, `focus:`, `disabled:` | apply in that state |
| `md:flex` | apply from medium screens up |

The `.btn` and `.input` classes are defined with `@apply` in [style.css](vue-app/src/style.css).

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Vue: forgot `.value` in script | `count.value++` |
| Vue: used `.value` in template | `{{ count }}` |
| Vue: `reactive` object reassigned | change its properties, or use `ref` |
| React: `count++` | `setCount(count + 1)` |
| React: `list.push(x)` | `setList([...list, x])` |
| React: `onClick={save()}` | `onClick={save}` or `onClick={() => save(id)}` |
| React: effect without dependency array that sets state | add `[]` or the right dependencies |
| React: `{list.length && <p/>}` prints `0` | `{list.length > 0 && <p/>}` |
| Both: index as `key` in a changing list | use a stable id |

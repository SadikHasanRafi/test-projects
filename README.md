# Learn Vue and React, side by side

Two apps with the **same 14 lessons**, so you can compare the syntax line by line.

| App | Stack | URL |
| --- | --- | --- |
| [vue-app/](vue-app/) | Vue 3 (`<script setup>`) · Vue Router · Pinia · Tailwind 4 · Vite · TypeScript | http://localhost:5173 |
| [react-app/](react-app/) | React 19 (hooks) · React Router · Zustand · Tailwind 4 · Vite · TypeScript | http://localhost:5174 |

## Run

Open two terminals.

```bash
# terminal 1
cd vue-app
pnpm install
pnpm dev
```

```bash
# terminal 2
cd react-app
pnpm install
pnpm dev
```

`pnpm build` in either folder checks the types and makes a production build. The API lesson needs internet.

## How to study

1. Open both apps in the browser, on the same lesson.
2. Open the two files from the table below in a split editor. The numbers `[1]`, `[2]` match between them.
3. Read that section in [COMPARISON.md](COMPARISON.md).
4. Change something, save, and watch the screen update.
5. Try the exercise.

| # | Topic | Vue file | React file |
| --- | --- | --- | --- |
| 1 | Template / JSX | [TemplatePage.vue](vue-app/src/pages/TemplatePage.vue) | [TemplatePage.tsx](react-app/src/pages/TemplatePage.tsx) |
| 2 | State & events | [StatePage.vue](vue-app/src/pages/StatePage.vue) | [StatePage.tsx](react-app/src/pages/StatePage.tsx) |
| 3 | Conditional rendering | [ConditionalPage.vue](vue-app/src/pages/ConditionalPage.vue) | [ConditionalPage.tsx](react-app/src/pages/ConditionalPage.tsx) |
| 4 | Lists | [ListPage.vue](vue-app/src/pages/ListPage.vue) | [ListPage.tsx](react-app/src/pages/ListPage.tsx) |
| 5 | Forms | [FormPage.vue](vue-app/src/pages/FormPage.vue) | [FormPage.tsx](react-app/src/pages/FormPage.tsx) |
| 6 | Computed / derived | [ComputedPage.vue](vue-app/src/pages/ComputedPage.vue) | [ComputedPage.tsx](react-app/src/pages/ComputedPage.tsx) |
| 7 | Watch, effects, lifecycle | [EffectPage.vue](vue-app/src/pages/EffectPage.vue) | [EffectPage.tsx](react-app/src/pages/EffectPage.tsx) |
| 8 | Components | [ComponentsPage.vue](vue-app/src/pages/ComponentsPage.vue) | [ComponentsPage.tsx](react-app/src/pages/ComponentsPage.tsx) |
| 9 | DOM refs | [RefPage.vue](vue-app/src/pages/RefPage.vue) | [RefPage.tsx](react-app/src/pages/RefPage.tsx) |
| 10 | Composables / hooks | [ComposablePage.vue](vue-app/src/pages/ComposablePage.vue) | [ComposablePage.tsx](react-app/src/pages/ComposablePage.tsx) |
| 11 | Shared state | [StorePage.vue](vue-app/src/pages/StorePage.vue) | [StorePage.tsx](react-app/src/pages/StorePage.tsx) |
| 12 | API calls | [ApiPage.vue](vue-app/src/pages/ApiPage.vue) | [ApiPage.tsx](react-app/src/pages/ApiPage.tsx) |
| 13 | Routing | [router.ts](vue-app/src/router.ts) | [App.tsx](react-app/src/App.tsx) |
| 14 | Todo mini app | [TodoPage.vue](vue-app/src/pages/TodoPage.vue) | [TodoPage.tsx](react-app/src/pages/TodoPage.tsx) |

## Folder layout

```
vue-app/src                     react-app/src
├── main.ts        start        ├── main.tsx       start
├── App.vue        layout       ├── App.tsx        layout + routes
├── router.ts      routes       │
├── pages/         lessons      ├── pages/         lessons
├── components/    reusable     ├── components/    reusable
├── composables/   useXxx       ├── hooks/         useXxx
└── stores/        Pinia        └── stores/        Zustand
```

## Exercises

Do each one in **both** apps.

1. Counter: stop it from going below 0, and disable the `-1` button at 0.
2. Conditional: show "Good morning" or "Good evening" based on the current hour.
3. List: add an input and button that add a new product.
4. Form: add an email field that must contain `@`.
5. Computed: show the total price of the products that are in stock.
6. API: load `/users` from the fake API and show the names.
7. Routing: add an `/about` page with a link in the sidebar.
8. Todo: let the user edit a todo's text.

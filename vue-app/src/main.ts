import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './style.css'

// Create the app, register plugins with .use(), attach it to <div id="app">
createApp(App).use(createPinia()).use(router).mount('#app')

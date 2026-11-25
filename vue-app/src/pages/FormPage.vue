<script setup lang="ts">
// LESSON 5: Forms and two-way binding
// v-model keeps the input and the state in sync, both directions.
import { reactive, ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'

const emptyForm = () => ({
  name: '',
  age: 18,
  bio: '',
  agree: false,
  skills: [] as string[],
  gender: 'other',
  country: 'bd',
})

const form = reactive(emptyForm())
const error = ref('')
const submitted = ref('')

function onSubmit() {
  if (!form.name) {
    error.value = 'Name is required'
    return
  }
  error.value = ''
  submitted.value = JSON.stringify(form, null, 2)
  Object.assign(form, emptyForm()) // reset
}
</script>

<template>
  <DemoCard title="[1] A full form">
    <!-- .prevent = event.preventDefault(), so the page doesn't reload -->
    <form class="flex flex-col items-start gap-3" @submit.prevent="onSubmit">
      <!-- .trim removes surrounding spaces -->
      <input v-model.trim="form.name" class="input" placeholder="Name" />
      <!-- .number converts the string to a number -->
      <input v-model.number="form.age" type="number" class="input" />
      <textarea v-model="form.bio" class="input" placeholder="Bio"></textarea>

      <!-- single checkbox -> boolean -->
      <label><input v-model="form.agree" type="checkbox" /> I agree</label>

      <!-- many checkboxes with the same v-model -> array -->
      <div class="flex gap-3">
        <label><input v-model="form.skills" type="checkbox" value="vue" /> Vue</label>
        <label><input v-model="form.skills" type="checkbox" value="react" /> React</label>
      </div>

      <div class="flex gap-3">
        <label><input v-model="form.gender" type="radio" value="male" /> Male</label>
        <label><input v-model="form.gender" type="radio" value="female" /> Female</label>
        <label><input v-model="form.gender" type="radio" value="other" /> Other</label>
      </div>

      <select v-model="form.country" class="input">
        <option value="bd">Bangladesh</option>
        <option value="in">India</option>
        <option value="us">USA</option>
      </select>

      <p v-if="error" class="text-red-600">{{ error }}</p>
      <button type="submit" class="btn" :disabled="!form.agree">Submit</button>
    </form>
  </DemoCard>

  <DemoCard title="[2] Live state">
    <pre class="text-xs">{{ form }}</pre>
  </DemoCard>

  <DemoCard v-if="submitted" title="[3] Submitted data">
    <pre class="text-xs">{{ submitted }}</pre>
  </DemoCard>
</template>

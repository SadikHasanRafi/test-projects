<script setup lang="ts">
// LESSON 8: Components: props (down), events (up), slots, v-model
import { ref } from 'vue'
import DemoCard from '../components/DemoCard.vue'
import NameInput from '../components/NameInput.vue'
import Panel from '../components/Panel.vue'
import UserCard from '../components/UserCard.vue'

const message = ref('')
const username = ref('Alex')

function handleGreet(text: string) {
  message.value = text
}
</script>

<template>
  <DemoCard title="[1] Props down, [2] events up">
    <!-- pass props like attributes, listen to events with @ -->
    <UserCard name="Rina" role="admin" @greet="handleGreet" />
    <UserCard name="Karim" @greet="handleGreet" />
    <p>Parent received: <b>{{ message }}</b></p>
  </DemoCard>

  <DemoCard title="[3] Slots">
    <Panel>
      <template #header>Custom header</template>
      <p>This paragraph was written in the parent.</p>
    </Panel>
    <Panel>Only body, header uses the fallback.</Panel>
  </DemoCard>

  <DemoCard title="[4] Two-way binding with a child">
    <NameInput v-model="username" />
    <p>Parent state: {{ username }}</p>
    <button class="btn" @click="username = ''">Clear from parent</button>
  </DemoCard>
</template>

<!-- SLOTS: the parent passes markup into the child -->
<template>
  <div class="overflow-hidden rounded-lg border border-slate-300">
    <header class="bg-slate-200 px-3 py-1 font-semibold">
      <!-- named slot, with fallback content -->
      <slot name="header">Default header</slot>
    </header>
    <div class="p-3">
      <slot />
      <!-- default slot -->
    </div>
  </div>
</template>

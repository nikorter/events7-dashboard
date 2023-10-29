<template>
  <div>
    <h1 style="padding: 15px 2rem">Events7 Dashboard</h1>
    <hr />
    <div class="container">
      <div class="card flex justify-content-center">
        <Menu :model="items" />
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from 'primevue/menu'

import { ref } from 'vue'

const items = ref([
  {
    label: 'Options',
    items: [
      { label: 'New', icon: 'pi pi-fw pi-plus', to: { name: 'new' } },
      { label: 'List', icon: 'pi pi-fw pi-list', to: { name: 'list' } }
    ]
  }
])
</script>

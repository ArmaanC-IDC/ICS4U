<template>
  <div class="app-shell">
    <AppNav />
    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue';
import {RouterView} from 'vue-router'

localStorage.setItem("products", JSON.stringify([
  { id: 2234, name: 'Vue Mastery Green Socks', color: 'green', price: 19.99 },
  { id: 2235, name: 'Vue Mastery Blue Socks', color: 'blue', price: 19.99 },
  { id: 3001, name: 'Hoodie', color: 'black', price: 49.99 }
]));

localStorage.setItem("reviews", "[]");
</script>

<style scoped>
    .app-shell { max-width: 1000px; margin: 0 auto; padding: 16px; }
    .page { padding-top: 12px; }
</style>

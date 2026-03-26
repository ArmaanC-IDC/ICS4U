<template>
  <!-- GLOBAL LOADING BAR -->
  <progress
    v-if="isLoading"
    class="progress is-primary is-small global-loader"
  ></progress>
  <div>
    <nav class="navbar is-dark" role="navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <strong>🏫</strong>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink class="navbar-item" to="/">Dashboard</RouterLink>
          <RouterLink class="navbar-item" to="/students">Students</RouterLink>
          <RouterLink class="navbar-item" to="/teachers">Teachers</RouterLink>
          <RouterLink class="navbar-item" to="/classes">Classes</RouterLink>
        </div>
      </div>
    </nav>

    <section class="section">
      <div class="container">
        <RouterView />
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
<<<<<<< HEAD
import { isLoading } from './components/loading'
=======
const isLoading = ref(false)
>>>>>>> 5cb0c36136650277ff353cb03337f08de86dec40
</script>

<style>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  border-radius: 0;
}
</style>
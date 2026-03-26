<template>
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
</script>

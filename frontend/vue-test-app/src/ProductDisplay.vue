<template>
    <p>Shipping: {{ premium ? 'Free' : '$2.99' }}</p>
</template>

<script setup>
defineProps({
  premium: Boolean
})
</script>
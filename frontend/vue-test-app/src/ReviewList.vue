<script setup>
defineProps({
  reviews: Array
})
</script>

<template>
  <div>
    <h3>Reviews</h3>

    <div v-for="(review, index) in reviews" :key="index">
      <p>{{ review.name }}</p>
      <p>Rating: {{ review.rating }}</p>
      <p>{{ review.review }}</p>
      <p>
        Recommended: {{review.recommend}}
      </p>
    </div>
  </div>
</template>
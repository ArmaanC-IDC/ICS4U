<script setup>
import { ref } from 'vue'

const emit = defineEmits(['review-submitted'])

const name = ref('')
const review = ref('')
const rating = ref(null)
const recommend = ref(null)

function onSubmit() {
  if (!name.value || !review.value || !rating.value || recommend.value === null) {
    alert('Complete all fields')
    return
  }

  emit('review-submitted', {
    name: name.value,
    review: review.value,
    rating: rating.value,
    recommend: recommend.value
  })

  // Reset form
  name.value = ''
  review.value = ''
  rating.value = null
  recommend.value = null
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <h3>Leave a Review</h3>

    <label>Name:</label>
    <input v-model="name" />

    <label>Review:</label>
    <textarea v-model="review"></textarea>

    <label>Rating:</label>
    <select v-model="rating">
      <option disabled value="">Select rating</option>
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>

    <label>Would you recommend this product?</label>
    <select v-model="recommend">
      <option disabled value="">Select option</option>
      <option :value="true">Yes</option>
      <option :value="false">No</option>
    </select>

    <button type="submit">Submit</button>
  </form>
</template>
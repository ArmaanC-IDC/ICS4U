<template>
  <section>
    <h1>Reviews</h1>
    <hr />
    <h3>Add New Review</h3>
    <div style="display: flex; width: 90%; justify-content: space-evenly; ">
        <select v-model="currentReviewProduct">
            <option disabled value="">Select product</option>
            <option v-for="product in products" :value="product.name">{{ product.name }}</option>
        </select>

        <div>
            <label>Name: </label> <br/>
            <input v-model="currentReviewName" />
        </div>

        <div>
            <label>Review: </label> <br/>
            <textarea v-model="currentReviewReview"></textarea>
        </div>

        <select v-model="currentReviewRating">
            <option disabled value="">Select Rating</option>
            <option v-for="rating in [1, 2, 3, 4, 5]" :value="rating">{{ rating }}</option>
        </select>

        <button @click="submit">Submit</button>

    </div>
    <hr />
    <h3>View Reviews</h3>
    <div v-for="review in reviews" :key="review.name + review.product">
        <h4>Product: {{ review.product }}</h4>
        <p>Name: {{ review.name }}</p>
        <p>Review: {{ review.review }}</p>
        <p>Rating: {{ review.rating }}</p>
    </div>
  </section>
</template>

<script setup>
import {ref} from "vue";
const products = JSON.parse(localStorage.getItem("products"));

const reviews = ref(JSON.parse(localStorage.getItem('reviews')) || []);

const currentReviewProduct = ref("");
const currentReviewName = ref("");
const currentReviewReview = ref("");
const currentReviewRating = ref(null); 

const submit = () => {
    console.log("submitting");
    if (!currentReviewProduct.value || !currentReviewName.value || !currentReviewReview.value || !currentReviewRating.value){
        alert("Enter all fields");
        return ;
    }
    reviews.value = [...reviews.value, {
        product: currentReviewProduct.value,
        name: currentReviewName.value,
        review: currentReviewReview.value,
        rating: currentReviewRating.value
    }];
    console.log("here3");
    localStorage.setItem("reviews", JSON.stringify(reviews.value));

    console.log("here4");

    currentReviewProduct.value = "";
    currentReviewName.value = "";
    currentReviewReview.value = "";
    currentReviewRating.value = null;
}

</script>

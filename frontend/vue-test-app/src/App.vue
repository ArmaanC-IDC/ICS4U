<template>
  <h1> {{ title }}</h1>
  <CartManager 
    @add-to-cart="addToCart" 
    @remove-from-cart="removeFromCart"
    :cart="cart" 
    :items="items"
  ></CartManager>

  <br>
  <a :href="url">GOOGLE</a>
  <p v-if="inventory > 10">In Stock</p>
  <p v-else-if="inventory>0">Almost sold out</p>
  <p v-else>Out of stock</p>
  <ul>
    <li v-for="detail in details">{{  detail }}</li>
  </ul>

  <div 
    v-for="variant in variants" 
    :key="variant.id" 
    class="color-circle"
    :style="{backgroundColor: variant.color}"
    @mouseover="updateImage(variant.image)"
    :class="{selected: image===variant.image}"
  > </div>
  <br>
  <img :src="image" width="250" :class="{'out-of-stock-img': inventory==0, rounded: true}">
  <ProductDisplay :premium="premium.value"></ProductDisplay>
  <ReviewForm @review-submitted="addReview" />
  <ReviewList :reviews="reviews" />
</template>

<script setup>
import { ref, computed } from "vue";
import "./styles.css";
import ProductDisplay from "./ProductDisplay.vue";
import CartManager from "./CartManager.vue";
import ReviewForm from './ReviewForm.vue'
import ReviewList from './ReviewList.vue'

const brand = ref('Vue Mastery')
const product = ref("Socks");
const url = ref("https://google.com");
const inventory = ref(20);
const details = ref(["50% cotton", "30% wool", "20% polyester"]);
const variants = ref([
        {id: 1, color: "red", image: "https://i5.walmartimages.com/asr/b75cd313-e19e-4135-9e30-9cf40e2c16f0.b87acbdb3ddeb6f215f3554ebc235765.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"},
        {id: 2, color: "blue", image: "https://i5.walmartimages.com/asr/a173af95-5d2a-4a40-8924-4f24d0c3ac9d.db5c01b03633a787f6d7e3b3ea68e574.jpeg"}
      ]);
const image = ref("https://i5.walmartimages.com/asr/a173af95-5d2a-4a40-8924-4f24d0c3ac9d.db5c01b03633a787f6d7e3b3ea68e574.jpeg");
const cart = ref([]);
const onSale = ref(false);
const premium = ref(false);
const items = ref([
  "socks1", "socks2", "socks3", "socks4", "socks5"
]);
const reviews = ref([])

function addReview(review) {
  reviews.value.push(review)
}
const title = computed(() => {
  return brand.value + ' ' + product.value + (onSale.value ? " is on sale" : " is not on sale")
});

const addToCart = (id) => {
  cart.value = [...cart.value, id];
}

const removeFromCart = (id) => {
  cart.value = cart.value.filter(c => c!==id);
}

const updateImage = (newImg) => {
  image.value = newImg;
}
</script>
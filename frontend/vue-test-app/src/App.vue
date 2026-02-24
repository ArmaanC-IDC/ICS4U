<template>
  <h1>Product: {{ product }}</h1>
  <h2>Current Cart: {{ cart }}</h2>
  <button @click="changeCart(1)">Increase Cart</button>
  <button v-if="cart!==0" @click="changeCart(-1)">Decrease Cart</button>
  <button v-if="cart!==0" @click="changeCart(-cart)">Reset Cart</button>

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
  <img :src="image" width="250" :class="{'out-of-stock-img': inventory==0, rounded: true}">
</template>

<script setup>
import { ref } from "vue";
import "./styles.css";
const product = ref("Socks");
const url = ref("https://google.com");
const inventory = ref(20);
const details = ref(["50% cotton", "30% wool", "20% polyester"]);
const variants = ref([
        {id: 1, color: "red", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"},
        {id: 2, color: "blue", image: "https://ix-marketing.imgix.net/focalpoint.png?auto=format,compress&w=3038"}
      ]);
const image = ref("https://images.unsplash.com/photo-1512436991641-6745cdb1723f");
const cart = ref(0);


const changeCart = (amt) => {
  cart.value += amt;
}

const updateImage = (newImg) => {
  image.value = newImg;
}
</script>
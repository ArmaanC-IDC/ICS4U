<template>
    <h2>Current Cart: {{ JSON.stringify(cart) }}</h2>
    <div style="display: flex">
        <div v-for="item in items">
            <h6>{{ item }}</h6>
            <button v-if="!cart.includes(item)" @click="addToCart(item)">Add to Cart</button>
            <button v-else @click="removeFromCart(item)">Remove from Cart</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    cart: Array,
    items: Array
});
const emit = defineEmits(['add-to-cart', 'remove-from-cart'])

function addToCart(id) {
    emit('add-to-cart', id)
}

function removeFromCart(id) {
    emit('remove-from-cart', id);
}
</script>

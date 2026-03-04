<template>
    <label>Username: </label>
    <input v-model="username">

    <label>Password: </label>
    <input v-model="password">

    <button @click="submit">Sign In</button>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref("");
const password = ref("");

const submit = () => {
    localStorage.setItem("username", username.value);
    router.push("/");
}

</script>
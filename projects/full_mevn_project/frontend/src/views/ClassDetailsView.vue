<template>
  <div>
    <h1 class="title">Class Details</h1>

    <div v-if="loading" class="notification is-info">Loading...</div>
    <div v-if="error" class="notification is-danger">{{ error }}</div>

    <div v-if="cls" class="box">
      <p><strong>{{ cls.code }}</strong> — {{ cls.name }}</p>
      <p class="mt-2"><strong>Teacher:</strong> {{ cls.teacherId?.lastName }}, {{ cls.teacherId?.firstName }}</p>

      <hr />

      <h2 class="subtitle">Students</h2>
      <ul>
        <li v-for="s in cls.studentIds" :key="s._id">
          {{ s.lastName }}, {{ s.firstName }} ({{ s.studentNumber }}) — Grade {{ s.grade }}
          <button class="button is-small is-danger is-light ml-2" @click="removeStudent(s._id)">Delete</button>
        </li>
      </ul>

      <div class="mt-4">
        <RouterLink class="button" to="/classes">Back</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { schoolApi } from '../api/schoolApi'

const props = defineProps({ id: { type: String, required: true } })

const cls = ref(null)
const loading = ref(false)
const error = ref('')

const loadClass = async () => {
  loading.value = true
  try {
    cls.value = await schoolApi.getClass(props.id)
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
}

const removeStudent = async (studentId) => {
  loading.value = true
  error.value = ''

  try {
    await schoolApi.removeStudentFromClass(props.id, studentId)
    await loadClass()        
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadClass)
</script>

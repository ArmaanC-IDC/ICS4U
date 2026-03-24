<template>
  <div>
    <h1 class="title">Student Details</h1>

    <div v-if="loading" class="notification is-info">Loading...</div>
    <div v-if="error" class="notification is-danger">{{ error }}</div>

    <div v-if="student" class="box">
      <div class="field">
        <label class="label">First Name</label>
        <input class="input" v-model.trim="student.firstName" />
      </div>

      <div class="field">
        <label class="label">Last Name</label>
        <input class="input" v-model.trim="student.lastName" />
      </div>

      <div class="field">
        <label class="label">Student Number</label>
        <input class="input" v-model.trim="student.studentNumber" />
      </div>

      <div class="field">
        <label class="label">Grade</label>
        <input class="input" type="number" v-model.number="student.grade" min="9" max="12" />
      </div>

      <div class="buttons">
        <button class="button is-primary" @click="save" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <RouterLink class="button" to="/students">Back</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { schoolApi } from '../api/schoolApi'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()

const student = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  loading.value = true
  try {
    student.value = await schoolApi.getStudent(props.id)
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  error.value = ''
  try {
    await schoolApi.updateStudent(props.id, student.value)
    router.push('/students')
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    saving.value = false
  }
}
</script>

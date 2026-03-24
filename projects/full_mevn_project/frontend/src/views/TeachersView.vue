<template>
  <div>
    <h1 class="title">Teachers</h1>

    <div class="columns">
      <div class="column is-5">
        <div class="box">
          <h2 class="subtitle">Add Teacher</h2>

          <div v-if="error" class="notification is-danger">{{ error }}</div>

          <form @submit.prevent="create">
            <div class="field">
              <label class="label">First Name</label>
              <input class="input" v-model.trim="form.firstName" />
            </div>
            <div class="field">
              <label class="label">Last Name</label>
              <input class="input" v-model.trim="form.lastName" />
            </div>
            <div class="field">
              <label class="label">Employee ID</label>
              <input class="input" v-model.trim="form.employeeId" />
            </div>
            <div class="field">
              <label class="label">Department</label>
              <input class="input" v-model.trim="form.department" />
            </div>

            <button class="button is-primary" :disabled="loading">
              {{ loading ? 'Saving...' : 'Create' }}
            </button>
          </form>
        </div>
      </div>

      <div class="column">
        <div class="box">
          <h2 class="subtitle">Teacher List</h2>
          <div v-if="loadingList" class="notification is-info">Loading...</div>

          <table class="table is-fullwidth is-striped" v-if="teachers.length">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in teachers" :key="t._id">
                <td>{{ t.lastName }}, {{ t.firstName }}</td>
                <td>{{ t.employeeId }}</td>
                <td>{{ t.department }}</td>
                <td class="has-text-right">
                  <button class="button is-small is-danger" @click="remove(t._id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="has-text-grey">No teachers yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { schoolApi } from '../api/schoolApi'

const teachers = ref([])
const loadingList = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  employeeId: '',
  department: ''
})

async function load() {
  loadingList.value = true
  error.value = ''
  try {
    teachers.value = await schoolApi.getTeachers()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loadingList.value = false
  }
}

function validate() {
  if (!form.firstName || !form.lastName || !form.employeeId || !form.department) return 'All fields are required.'
  return ''
}

async function create() {
  const msg = validate()
  if (msg) { error.value = msg; return }

  loading.value = true
  error.value = ''
  try {
    await schoolApi.createTeacher({ ...form })
    form.firstName = ''
    form.lastName = ''
    form.employeeId = ''
    form.department = ''
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this teacher?')) return
  try {
    await schoolApi.deleteTeacher(id)
    await load()
  } catch (e) {
    alert(e?.response?.data?.message || e.message)
  }
}

onMounted(load)
</script>

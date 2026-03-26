<template>
  <div>
    <h1 class="title">Students</h1>

    <div class="columns">
      <div class="column is-5">
        <div class="box">
          <h2 class="subtitle">Add Student</h2>

          <div v-if="error" class="notification is-danger">{{ error }}</div>

          <form @submit.prevent="create">
            <div class="field">
              <label class="label">First Name</label>
              <div class="control">
                <input class="input" v-model.trim="form.firstName" />
              </div>
            </div>

            <div class="field">
              <label class="label">Last Name</label>
              <div class="control">
                <input class="input" v-model.trim="form.lastName" />
              </div>
            </div>

            <div class="field">
              <label class="label">Student Number</label>
              <div class="control">
                <input class="input" v-model.trim="form.studentNumber" />
              </div>
            </div>

            <div class="field">
              <label class="label">Grade</label>
              <div class="control">
                <input class="input" type="number" v-model.number="form.grade" min="9" max="12" />
              </div>
            </div>

            <button class="button is-primary" :disabled="loading">
              {{ loading ? 'Saving...' : 'Create' }}
            </button>
          </form>
        </div>
      </div>

      <div class="column">
        <div class="box">
          <h2 class="subtitle">Student List</h2>

          <div v-if="loadingList" class="notification is-info">Loading...</div>

          <table class="table is-fullwidth is-striped" v-if="students.length">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in students" :key="s._id">
                <td>{{ s.lastName }}, {{ s.firstName }}</td>
                <td>{{ s.studentNumber }}</td>
                <td>{{ s.grade }}</td>
                <td class="has-text-right">
                  <RouterLink class="button is-small" :to="{ name: 'student-details', params: { id: s._id } }">
                    Details
                  </RouterLink>
                  <button class="button is-small is-danger ml-2" @click="remove(s._id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="has-text-grey">No students yet.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': showSuccessModal }">
    <div class="modal-background" @click="showSuccessModal = false"></div>
    
    <div class="modal-content">
      <div class="box has-text-centered">
        <h2 class="title is-4">Success!</h2>
        <p>The student has been added to the database.</p>
        <button class="button is-success mt-4" @click="showSuccessModal = false">
          Awesome
        </button>
      </div>
    </div>

    <button 
      class="modal-close is-large" 
      aria-label="close" 
      @click="showSuccessModal = false"
    ></button>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { schoolApi } from '../api/schoolApi'

const students = ref([])
const loadingList = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  studentNumber: '',
  grade: 9
});

const showSuccessModal = ref(false);

async function load() {
  loadingList.value = true
  error.value = ''
  try {
    students.value = await schoolApi.getStudents()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loadingList.value = false
  }
}

function validate() {
  if (!form.firstName || !form.lastName || !form.studentNumber) return 'All fields are required.'
  if (form.grade < 9 || form.grade > 12) return 'Grade must be 9–12.'
  return ''
}

async function create() {
  const msg = validate()
  if (msg) { error.value = msg; return }

  loading.value = true
  error.value = ''
  try {
    await schoolApi.createStudent({ ...form })
    form.firstName = ''
    form.lastName = ''
    form.studentNumber = ''
    form.grade = 9
    await load()

    showSuccessModal.value = true
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this student?')) return
  try {
    await schoolApi.deleteStudent(id)
    await load()
  } catch (e) {
    alert(e?.response?.data?.message || e.message)
  }
}

onMounted(load)
</script>

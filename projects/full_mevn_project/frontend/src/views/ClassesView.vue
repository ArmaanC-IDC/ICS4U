<template>
  <div>
    <h1 class="title">Classes</h1>

    <div class="columns">
      <div class="column is-5">
        <div class="box">
          <h2 class="subtitle">Create Class</h2>

          <div v-if="error" class="notification is-danger">{{ error }}</div>

          <form @submit.prevent="create">
            <div class="field">
              <label class="label">Code</label>
              <input class="input" v-model.trim="form.code" placeholder="ICS4U" />
            </div>

            <div class="field">
              <label class="label">Name</label>
              <input class="input" v-model.trim="form.name" placeholder="Computer Science" />
            </div>

            <div class="field">
              <label class="label">Teacher</label>
              <div class="select is-fullwidth">
                <select v-model="form.teacherId">
                  <option disabled value="">Choose a teacher</option>
                  <option v-for="t in teachers" :key="t._id" :value="t._id">
                    {{ t.lastName }}, {{ t.firstName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="field">
              <label class="label">Students (Ctrl/Cmd click for multiple)</label>
              <div class="select is-multiple is-fullwidth">
                <select multiple size="6" v-model="form.studentIds">
                  <option v-for="s in students" :key="s._id" :value="s._id">
                    {{ s.lastName }}, {{ s.firstName }} ({{ s.studentNumber }})
                  </option>
                </select>
              </div>
            </div>

            <button class="button is-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Create Class' }}
            </button>
          </form>
        </div>
      </div>

      <div class="column">
        <div class="box">
          <h2 class="subtitle">Class List</h2>
          <div v-if="loading" class="notification is-info">Loading...</div>

          <table class="table is-fullwidth is-striped" v-if="classes.length">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Teacher</th>
                <th>Students</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in classes" :key="c._id">
                <td>{{ c.code }}</td>
                <td>{{ c.name }}</td>
                <td>{{ c.teacherId?.lastName }}, {{ c.teacherId?.firstName }}</td>
                <td>{{ c.studentIds?.length || 0 }}</td>
                <td class="has-text-right">
                  <RouterLink class="button is-small" :to="{ name: 'class-details', params: { id: c._id } }">Details</RouterLink>
                  <button class="button is-small is-danger ml-2" @click="remove(c._id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="has-text-grey">No classes yet.</p>
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

const teachers = ref([])
const students = ref([])
const classes = ref([])

const loading = ref(false)
const saving = ref(false)
const error = ref('')

const form = reactive({
  code: '',
  name: '',
  teacherId: '',
  studentIds: []
});

let showSuccessModal = ref(false);

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    const [t, s, c] = await Promise.all([
      schoolApi.getTeachers(),
      schoolApi.getStudents(),
      schoolApi.getClasses()
    ])
    teachers.value = t
    students.value = s
    classes.value = c
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    loading.value = false
  }
}

function validate() {
  if (!form.code || !form.name || !form.teacherId) return 'Code, name, and teacher are required.'
  return ''
}

async function create() {
  const msg = validate()
  if (msg) { error.value = msg; return }

  saving.value = true
  error.value = ''
  try {
    await schoolApi.createClass({
      code: form.code,
      name: form.name,
      teacherId: form.teacherId,
      studentIds: form.studentIds
    })
    form.code = ''
    form.name = ''
    form.teacherId = ''
    form.studentIds = []
    await loadAll()

    showSuccessModal.value = true;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this class?')) return
  try {
    await schoolApi.deleteClass(id)
    await loadAll()
  } catch (e) {
    alert(e?.response?.data?.message || e.message)
  }
}

onMounted(loadAll)
</script>

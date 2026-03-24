<template>
  <div>
    <h1 class="title">Dashboard</h1>
    <p class="subtitle">Use the navbar to manage Students, Teachers, and Classes.</p>

    <div class="columns">
      <div class="column">
        <div class="box">
          <p class="heading">Students</p>
          <p class="title is-4">{{ counts.students }}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="heading">Teachers</p>
          <p class="title is-4">{{ counts.teachers }}</p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="heading">Classes</p>
          <p class="title is-4">{{ counts.classes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { schoolApi } from '../api/schoolApi'

const counts = reactive({ students: 0, teachers: 0, classes: 0 })

onMounted(async () => {
  const [students, teachers, classes] = await Promise.all([
    schoolApi.getStudents(),
    schoolApi.getTeachers(),
    schoolApi.getClasses()
  ])
  counts.students = students.length
  counts.teachers = teachers.length
  counts.classes = classes.length
})
</script>

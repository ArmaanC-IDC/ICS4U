import { http } from './http'

export const schoolApi = {
  // Students
  getStudents: () => http.get('/students').then(r => r.data),
  getStudent: (id) => http.get(`/students/${id}`).then(r => r.data),
  createStudent: (payload) => http.post('/students', payload).then(r => r.data),
  updateStudent: (id, payload) => http.put(`/students/${id}`, payload).then(r => r.data),
  deleteStudent: (id) => http.delete(`/students/${id}`).then(r => r.data),

  // Teachers
  getTeachers: () => http.get('/teachers').then(r => r.data),
  getTeacher: (id) => http.get(`/teachers/${id}`).then(r => r.data),
  createTeacher: (payload) => http.post('/teachers', payload).then(r => r.data),
  updateTeacher: (id, payload) => http.put(`/teachers/${id}`, payload).then(r => r.data),
  deleteTeacher: (id) => http.delete(`/teachers/${id}`).then(r => r.data),

  // Classes
  getClasses: () => http.get('/classes').then(r => r.data),
  getClass: (id) => http.get(`/classes/${id}`).then(r => r.data),
  createClass: (payload) => http.post('/classes', payload).then(r => r.data),
  updateClass: (id, payload) => http.put(`/classes/${id}`, payload).then(r => r.data),
  deleteClass: (id) => http.delete(`/classes/${id}`).then(r => r.data)
}

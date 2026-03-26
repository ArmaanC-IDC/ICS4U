import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< HEAD
import { isLoading } from '../components/loading'
=======
// import { isLoading } from '../App.vue'
>>>>>>> 5cb0c36136650277ff353cb03337f08de86dec40

const DashboardView = () => import('../views/DashboardView.vue')
const StudentsView = () => import('../views/StudentsView.vue')
const StudentDetailsView = () => import('../views/StudentDetailsView.vue')
const TeachersView = () => import('../views/TeachersView.vue')
const ClassesView = () => import('../views/ClassesView.vue')
const ClassDetailsView = () => import('../views/ClassDetailsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/students', name: 'students', component: StudentsView },
    { path: '/students/:id', name: 'student-details', component: StudentDetailsView, props: true },
    { path: '/teachers', name: 'teachers', component: TeachersView },
    { path: '/classes', name: 'classes', component: ClassesView },
    { path: '/classes/:id', name: 'class-details', component: ClassDetailsView, props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // isLoading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    // isLoading.value = false
  }, 300)
})

export default router
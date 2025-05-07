import { createRouter, createWebHistory } from 'vue-router'
import UploadResource from '../pages/student/UploadResource.vue'
import Homework from '../pages/student/Homework.vue'
import ViewResource from '../pages/student/ViewResource.vue'
import HomeworkTeacher from '../pages/teacher/HomeworkTeacher.vue'
import Attendance from '../pages/teacher/Attendance.vue'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/login', component: Login },
        { path: '/UploadResource', component: UploadResource },
        { path: '/Homework', component: Homework },
        { path: '/ViewResource', component: ViewResource },
        { path: '/HomeworkTeacher', component: HomeworkTeacher },
        { path: '/Attendance', component: Attendance },
    ]
})

export default router
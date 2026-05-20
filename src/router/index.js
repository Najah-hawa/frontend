import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
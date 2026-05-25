import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import AdminView from '../views/AdminView.vue';
import AddProductView from '../views/AddProductView.vue';
import AddCategoryView from '../views/AddCategoryView.vue';
import EditProductView from '../views/EditProductView.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false } // Kräver inte inloggning
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView, 
        meta: { requiresAuth: true } // KRÄVER INLOGGNING
    },
    {
    path: '/admin/add-product',
    name: 'AddProduct',
    component: AddProductView
    },
    {
    path: '/admin/add-category',
    name: 'AddCategory',
    component: AddCategoryView
    },
    {
    path: '/admin/edit-product/:id',
    name: 'EditProduct',
    component: EditProductView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// GLOBAL RUTT-VAKT 
router.beforeEach((to, from, next) => {
    // Kolla om den sida vi är på väg till kräver inloggning
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // Kolla om det finns en token sparad i localStorage
    const isAuthenticated = localStorage.getItem('token');

    if (requiresAuth && !isAuthenticated) {
        // Om sidan kräver inloggning men användaren inte är inloggad -> Skicka till login
        //och bifoga en query-parameter med ett felmeddelande
       next({ 
            path: '/', 
            query: { alert: 'Du måste vara inloggad för att se den sidan.' } 
        });
    } else if (to.path === '/' && isAuthenticated) {
        // Om användaren redan ÄR inloggad men försöker gå till login -> Skicka direkt till admin
        next('/admin');
    } else {
        // Annars, låt användaren passera som vanligt
        next();
    }
});

export default router;
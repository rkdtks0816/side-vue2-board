import { createWebHistory, createRouter} from 'vue-router';
import home from '@/views/home.vue';
import create from '@/views/create.vue';
import view from '@/views/view.vue';
import edit from '@/views/edit.vue';
import signIn from '@/views/signIn.vue';
import signUp from '@/views/signUp.vue';
import authenticate from '@/views/authenticate.vue';
import store from '@/store';

const privatePage = (to, from , next)=> {
    const userInfo = store.state.user_profile   

    const token = window.$cookies.get('token')  
    if (!token) {
        next()
    } else if (!userInfo) {
        next({path: '/authenticate', query: {redirect: to.fullPath}})
    } else{
        next()
    }
};

const routes = [
    {
        path: '/',
        name: 'home',
        component: home,
        beforeEnter: privatePage
    },
    {
        path: '/create',
        name: 'create',
        component: create,
        beforeEnter: privatePage
    },
    {
        path: '/view/:post_id',
        name: 'view',
        component: view,
        beforeEnter: privatePage
    },
    {
        path: '/edit/:post_id',
        name: 'edit',
        component: edit,
        beforeEnter: privatePage
    },
    {
        path: '/sign-in',
        name: 'sign-in',
        component: signIn
    },
    {
        path: '/sign-up',
        name: 'sign-up',
        component: signUp
    },
    {
        path: '/authenticate',
        name: 'authenticate',
        component: authenticate
    }
];

const router = createRouter({
	history : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
          return { top: 0 }
        }
    },
});

export default router;
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login';
import Employee from "../views/Employee";
import Main from "../views/Main";
import Schedule from "../views/Schedule";
import firebase from "../firebaseinit";
import Register from "../views/Register";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: Schedule,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/employee',
    name: 'employee',
    component: Employee,
    meta:{
      requiresAuth: true
    }
  },
];

const router = new VueRouter({
  routes
})


router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !await firebase.getCurrentUser()) {
    next('login');
  } else {
    next();
  }
});


export default router

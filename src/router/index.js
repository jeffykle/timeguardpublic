import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Profile from '@/views/Profile.vue'
import Client from '@/views/Client.vue'

import Callback from '@/views/Callback.vue'
import ErrorPage from '@/views/Error.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: '/:userid&:timerid',
    name: 'Client',
    component: Client,
  },
  {
    path: '/client/:timerid',
    name: 'Client',
    component: Client,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    // beforeEnter: routeGuard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    // beforeEnter: routeGuard
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: ErrorPage,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

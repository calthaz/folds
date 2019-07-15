import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/Home.vue'
import LoginPage from './views/Login.vue'
import RegisterPage from './views/Register.vue'
import EditPage from './views/Edit.vue'
import OverviewPage from './views/Overview.vue'
import CollectionPage from './views/Collection.vue'
import EditCollection from './views/EditCollection.vue'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/edit', component: EditPage },
    { path: '/u/:username', component: OverviewPage}, 
    { path: '/u/:username/:collectionName', component: CollectionPage},
    { path: '/editCollection/:collectionName', component: EditCollection},
    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})
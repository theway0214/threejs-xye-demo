import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuView from '../views/menuView.vue'
import EnvironmentView from '../views/EnvironmentView.vue'
import ShadowView from '../views/ShadowView/index.vue'
import OpenDoorView from '../views/OpenDoor/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/menu',
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView,
    },
    {
      path: '/object',
      name: 'object',
      component: HomeView,
    },
    {
      path: '/shadow',
      name: 'shadow',
      component: ShadowView,
    },
    {
      path: '/environment',
      name: 'environment',
      component: EnvironmentView,
    },
    {
      path: '/open-door',
      name: 'open-door',
      component: OpenDoorView,
    },
  ],
})

export default router

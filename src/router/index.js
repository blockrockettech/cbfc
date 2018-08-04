import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/pages/Home';
import MyCards from '@/components/pages/MyCards';
import MyCard from '@/components/pages/MyCard';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {x: 0, y: 0};
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/mycards',
      name: 'mycards',
      component: MyCards
    },
    {
      path: '/mycards/:tokenId',
      name: 'mycard',
      component: MyCard,
      props: true
    },
  ]
});

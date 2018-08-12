// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import logging from './logging';
import AsyncComputed from 'vue-async-computed';
import Web3 from 'web3';

import Notifications from 'vue-notification';

Vue.use(Notifications);

Vue.use(AsyncComputed);

Vue.config.productionTip = false;

Vue.filter('toEth', function (value) {
  if (!value) return '';
  return Web3.utils.fromWei(value.toString(10), 'ether').valueOf();
});

Vue.filter('to2Dp', function (value) {
  if (!value) return '';
  return new BigNumber(value.toString(10)).toFormat(2);
});

Vue.filter('to0Dp', function (value) {
  if (!value) return '';
  return new BigNumber(value.toString(10)).toFormat(0);
});

;(async () => {
  try {
    // pre-Vue JS bootstrap
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
  } finally {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      store,
      router,
      logging,
      components: {App},
      template: '<App/>'
    });
  }
})();

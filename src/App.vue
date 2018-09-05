<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-top">
        <router-link :to="{ name: 'home' }" class="navbar-brand pl-5">
          <img src="../static/Kota_logo_H-01.svg" style="max-height: 50px"/>
        </router-link>

        <ul class="navbar-nav mr-auto"></ul>
        <ul class="navbar-nav">
          <li class="nav-item pr-5">
            <router-link :to="{ name: 'mycards' }" class="nav-link">My KOTAs&nbsp;&nbsp;<span class="badge badge-secondary" v-if="assetsPurchasedByAccount">{{ assetsPurchasedByAccount.length }}</span></router-link>
          </li>
        </ul>

      </nav>
    </header>

    <main role="main" class="container main-container mt-5">
      <router-view></router-view>
    </main>

    <footer class="footer bg-primary">
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <small class="slogan">BE ORIGINAL. BUY ORIGINAL.</small>
          </div>
          <div class="col-sm text-center">
            <small>
              <router-link :to="{ name: 'home' }">Home</router-link> &bull;
              <router-link :to="{ name: 'mycards' }">My KOTAs</router-link>
            </small>
          </div>
          <div class="col-sm text-right">
            <small class="">
              <current-network></current-network>
            </small>
          </div>
        </div>
      </div>
    </footer>

    <notifications group="tx" position="bottom left"/>
  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3';
  import { mapGetters, mapState } from 'vuex';
  import * as actions from './store/actions';
  import * as mutations from './store/mutation-types';
  import CurrentNetwork from './components/ui-controls/CurrentNetwork';

  export default {
    name: 'app',
    components: {
      CurrentNetwork
    },
    computed: {
      ...mapState(['account', 'assetsPurchasedByAccount']),
      ...mapGetters([]),
    },
    mounted () {

      let bootStrappedWeb3;

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        bootStrappedWeb3 = new Web3(web3.currentProvider);
      } else {
        console.log('No web3! You should consider trying MetaMask or an Ethereum browser');
        console.log('Falling back to using HTTP Provider');

        bootStrappedWeb3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/nbCbdzC6IG9CF6hmvAVQ'));
      }

      window.web3 = bootStrappedWeb3;

      // Bootstrap the full app
      this.$store.dispatch(actions.INIT_APP, bootStrappedWeb3);

      setInterval(function () {
        console.log('refreshing...');
        this.$store.dispatch(actions.REFRESH_CONTRACT_DETAILS);
      }.bind(this), 2000);
    },
  };
</script>

<style lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Poppins:400,700');

  $body-bg: #f2f5fb;
  $body-color: #545454;
  $primary: #545454;
  $secondary: #f2f5fb;
  $black: #000000;

  $font-family-base: 'Poppins', 'Avenir', Helvetica, Arial, sans-serif;

  @import '../node_modules/bootstrap/scss/bootstrap.scss';

  /* Sticky footer styles
-------------------------------------------------- */
  html {
    position: relative;
    min-height: 100%;
  }

  body {
    margin-bottom: 60px;
    margin-top: 10px;
    padding-top: 50px;
    padding-bottom: 50px;
    background-color: $body-color;
    /*background-image: url("../static/Stina_bg_test.png");*/
    /*background-size: 100%;*/
  }

  .main-container {

  }

  nav {
    background-color: $black;
  }

  .navbar-brand {
    font-size: 1.5rem;
  }

  .navbar-dark .badge {
    position: relative;
    top: -10px;
    right: 0px;
    opacity: 0.75;
    font-size: 0.65rem;
  }

  /* mobile only */
  @media screen and (max-width: 767px) {
    body {
      padding-bottom: 100px;
    }

    .footer {
      .col-sm {
        padding-bottom: 10px;
      }
    }

    h1 {
      font-size: 1.5rem;
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    min-height: 60px;
    line-height: 25px;
    background-color: $body-color;
  }

  body > .container {
    padding: 60px 60px 0;
  }

  .footer > .container {
    padding: 15px;
    color: #f2f5fb;

    .slogan {
      color: rgba(255, 255, 255, 0.5);
    }

    a {
      color: #f2f5fb;
      padding-left: 2px;
      padding-right: 2px;
    }
  }
</style>

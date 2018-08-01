<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-4">Welcome to the world of KOTA</h1>
      <p class="lead">Get lucky</p>
      <hr class="my-4">
      <ul>
        <li>Cost per pack: {{ costOfPack | toEth }} ETH</li>
        <li>Cards per pack: {{ cardsPerPack.toString(10) }}</li>
      </ul>
      <p class="lead">
        <a class="btn btn-primary btn-lg" href="#" role="button">Buy now</a>
      </p>
    </div>

  </div>
</template>

<script>

  import {mapGetters, mapState} from 'vuex';
  import LoadingSpinner from '../ui-controls/LoadingSpinner.vue';
  import * as actions from '../../store/actions';


  export default {
    name: 'home',
    components: {
      LoadingSpinner
    },
    computed: {
      ...mapState(['costOfPack', 'cardsPerPack']),
      ...mapGetters([])
    }
  };
</script>

<style scoped lang="scss">
</style>

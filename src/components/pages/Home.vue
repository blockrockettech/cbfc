<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-4">Are you ready to rock?</h1>
      <p class="lead">Buy lucky packs of <span class="text-primary">Bands FC</span> cards</p>
      <hr class="my-4">
      <div class="text-center">
        <ul>
          <li>Cost per pack: {{ costOfPack | toEth }} ETH</li>
          <li>Cards per pack: {{ cardsPerPack.toString(10) }}</li>
        </ul>
        <p class="lead">
          <a class="btn btn-primary btn-lg" href="#" role="button" @click="BUY_PACK()">Buy now</a>
        </p>
      </div>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState, mapActions } from 'vuex';
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
    },
    methods: {
      ...mapActions([
        actions.BUY_PACK
      ])
    }
  };
</script>

<style scoped lang="scss">
</style>

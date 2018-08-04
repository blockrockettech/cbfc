<template>
  <div class="jumbotron">
    <h1 class="display-4">Buy lucky packs of <span class="text-primary">KOTA</span> cards</h1>
    <h2><span class="badge badge-primary">SOLD {{ totalCardsInCirculationSold.toString(10) }} of {{ totalCardsInCirculation.toString(10) }}</span> </h2>
    <p class="lead"></p>
    <div class="text-center">
      <ul>
        <li>Cost per Pack: {{ costOfPack | toEth }} ETH</li>
        <li>Cards per Pack: {{ cardsPerPack.toString(10) }}</li>
        <li>Individual Cards: {{ cardSetsInCirculation.toString(10) }}</li>
      </ul>
      <p class="lead">
        <a class="btn btn-primary btn-lg" href="#" role="button" @click="BUY_PACK()">Buy now</a>
      </p>
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
      ...mapState([
        'costOfPack',
        'cardsPerPack',
        'totalCardsInCirculation',
        'totalCardsInCirculationSold',
        'cardSetsInCirculation'
      ]),
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

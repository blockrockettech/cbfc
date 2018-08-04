<template>
  <div class="jumbotron">
    <h1 class="display-4">Buy lucky packs of <span class="text-primary">KOTA</span> cards</h1>
    <h2><span class="badge badge-primary">SOLD {{ totalCardsInCirculationSold.toString(10) }} of {{ totalCardsInCirculation.toString(10) }}</span></h2>
    <div class="row text-center mt-5">
      <div class="col">
        <a class="btn btn-primary btn-xlg" href="#" role="button" @click="BUY_PACK()">Buy Now</a>
        <ul>
          <li>Cost per Pack: {{ costOfPack | toEth }} ETH</li>
          <li>Cards per Pack: {{ cardsPerPack.toString(10) }}</li>
        </ul>
      </div>
      <div class="col" v-if="accountCredits.toNumber()">
        <a class="btn btn-primary btn-xlg" href="#" role="button" @click="BUY_PACK()">Redeem Pack</a>
      </div>
    </div>
    <div class="row">
      <div class="col">
        Individual Cards: {{ cardSetsInCirculation.toString(10) }}
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
      ...mapState([
        'costOfPack',
        'cardsPerPack',
        'totalCardsInCirculation',
        'totalCardsInCirculationSold',
        'cardSetsInCirculation',
        'accountCredits'
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
  .btn-xlg {
    padding: 0.75rem 1.25rem;
    font-size: 2rem;
    line-height: 2;
  }
</style>

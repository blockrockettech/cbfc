<template>
  <div>
    <h1 class="display-4">Buy lucky packs of <span class="text-primary">KOTA</span> cards</h1>
    <h2 v-if="cardSetsInCirculation && totalCardsInCirculation && totalCardsInCirculationSold">
      <span class="badge badge-primary">{{totalCardsInCirculationSold.toNumber() }} SOLD</span>
      <span class="badge badge-primary">{{ totalCardsInCirculation.toNumber() - totalCardsInCirculationSold.toNumber() }} LEFT</span>
      <span class="badge badge-primary">{{ cardSetsInCirculation.toString(10) }} UNIQUE CARDS</span>
    </h2>
    <div class="row mt-5">
      <div class="col text-right m-3">
        <a class="btn btn-primary btn-xlg" href="#" role="button" @click="BUY_PACK()">Buy Pack</a>
        <ul class="mt-2" v-if="cardsPerPack && costOfPack">
          <li><span class="text-muted">Cost per Pack:</span> {{ costOfPack | toEth }} ETH</li>
          <li><span class="text-muted">Cards per Pack:</span> {{ cardsPerPack.toString(10) }}</li>
        </ul>
      </div>
      <div class="col text-left m-3" v-if="accountCredits && accountCredits.toNumber()">
        <a class="btn btn-primary btn-xlg" href="#" role="button" @click="REDEEM_PACK()">Redeem Pack</a>
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
        actions.BUY_PACK,
        actions.REDEEM_PACK
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

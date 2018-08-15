<template>
  <div>
    <h1 class="display-4">Buy packs of <span class="text-primary">KOTA</span> cards</h1>
    <h2 v-if="totalCardsInCirculation && totalCardsInCirculationSold">
      <span class="badge badge-primary">{{ totalCardsInCirculation.toNumber() }} EXIST</span>
      <span class="badge badge-primary">{{ totalCardsInCirculationSold.toNumber() }} SOLD</span>
    </h2>
    <div class="row mt-5">
      <div class="col kota-box m2" v-for="box in boxNumbers">
        <h2>BOX {{ box.toString(10) }}</h2>
        <div class="row">
          <div class="col">
            <a class="btn btn-primary btn-xlg" href="#" role="button" @click="BUY_PACK(box)">Buy Pack</a>
            <ul class="mt-2" v-if="cardsPerPack && costOfPack">
              <li><span class="small">Cost per Pack:</span> {{ costOfPack | toEth }} ETH</li>
              <li><span class="small">Cards per Pack:</span> {{ cardsPerPack.toString(10) }}</li>
            </ul>
          </div>
          <div class="col">
            <a class="btn btn-primary btn-xlg" href="#" role="button" @click="REDEEM_PACK(box)">Redeem Pack</a>
          </div>
        </div>
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
        'accountCredits',
        'boxNumbers'
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
  $body-bg: #f2f5fb;
  $body-color: #545454;
  $primary: #545454;
  $secondary: #132cc4;

  .kota-box {
    background-color: $secondary;
    margin: 20px;
    color: $body-bg;
  }

  .btn-xlg {
    padding: 0.75rem 1.25rem;
    font-size: 2rem;
    line-height: 2;
  }
</style>

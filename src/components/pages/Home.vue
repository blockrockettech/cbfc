<template>
  <div>
    <div class="row" v-for="boxNumber in boxNumbers">
      <div class="col-sm-12 kota-box mb-5" v-bind:class="{'stina': boxNumber.toString(10) === '1000000', 'kota': boxNumber.toString(10) !== '1000000'}">
        <!--<span class="badge badge-light">{{ box.toString(10) }}</span>-->
        <img v-if="boxNumber.toString(10) === '1000000'" src="../../../static/StinaJones1_Profile@x2.png" style="max-width: 100px; margin: 10px"/>
        <img v-if="boxNumber.toString(10) !== '1000000'" src="../../../static/coinjournal_x2.png" style="max-width: 100px; margin: 10px"/>
        <h1>
          <span class="kota-box-text pl-3 pr-3">{{ boxes[boxNumber.toNumber()][1] }}</span>
          <span class="kota-box-text pl-3 pr-3">{{ boxes[boxNumber.toNumber()][2] }}</span>
        </h1>
        <div class="row text-center pt-4 pb-4">
          <div class="col">
            <!--<img src="../../../static/Card_back.jpg" style="max-height: 150px; transform: rotate(20deg);"/>-->
            <!--<img src="../../../static/Card_back.jpg" style="max-height: 150px; transform: rotate(20deg);"/>-->
            <!--<img src="../../../static/Card_back.jpg" style="max-height: 150px; transform: rotate(20deg);"/>-->

            <!--<div class="clearfix mb-2"></div>-->

            <a class="btn btn-warning btn-xlg" href="#" role="button" @click="BUY_PACK(boxNumber)">Buy Pack</a>
            <ul class="mt-2" v-if="cardsPerPack && costOfPack">
              <li><span class="small">Cost per Pack:</span> {{ costOfPack | toEth }} ETH</li>
              <li><span class="small">Cards per Pack:</span> {{ cardsPerPack.toString(10) }}</li>
            </ul>
          </div>
          <div class="col" v-if="accountCredits.toNumber() > 0">
            <!--<img src="../../../static/Card_back.jpg" style="max-height: 150px; transform: rotate(20deg);"/>-->
            <!--<img src="../../../static/Card_back.jpg" style="max-height: 150px; transform: rotate(20deg);"/>-->
            <!--<img src="../../../static/Card_back.jpg" style="max-height: 150px; transform: rotate(20deg);"/>-->

            <!--<div class="clearfix mb-2"></div>-->

            <a class="btn btn-warning btn-xlg" href="#" role="button" @click="REDEEM_PACK(boxNumber)">Redeem Pack</a>
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
        'boxNumbers',
        'boxes'
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
  $secondary: #f2f5fb;

  .kota-box {
  }

  .kota-box-text {
    background-color: $body-color;
    color: $secondary;
  }

  .stina {
    background-image: url("../../../static/Stina_bg_test.jpg");
    background-size: 100%;
  }

  .kota {
    background-image: url("../../../static/1920px_bg_Kota_sml.jpg");
    background-size: 100%;
  }

  .btn-xlg {
    padding: 0.75rem 1.25rem;
    font-size: 2rem;
    line-height: 2;
  }
</style>

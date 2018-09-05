<template>
  <div class="row bg-stina">
    <div class="col-sm-12 kota-box mb-5" v-if="boxes && boxNumber">
      <!--<span class="badge badge-light">{{ box.toString(10) }}</span>-->
      <img v-if="boxNumber === '1000000'" src="../../../static/StinaJones1_Profile@x2.png" style="max-width: 100px; margin: 10px"/>
      <h1>
        {{ boxes[boxNumber] }}
      </h1>
      <h2>{{ boxes[boxNumber] }}</h2>
      <div class="row text-center pt-5">
        <div class="col">
          <a class="btn btn-secondary btn-xlg" href="#" role="button" @click="BUY_PACK(boxNumber)">Buy Pack</a>
          <ul class="mt-2" v-if="cardsPerPack && costOfPack">
            <li><span class="small">Cost per Pack:</span> {{ costOfPack | toEth }} ETH</li>
            <li><span class="small">Cards per Pack:</span> {{ cardsPerPack.toString(10) }}</li>
          </ul>
        </div>
        <div class="col" v-if="accountCredits && accountCredits.toNumber() > 0">
          <a class="btn btn-secondary btn-xlg" href="#" role="button" @click="REDEEM_PACK(boxNumber)">Redeem Pack</a>
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
        'accountCredits',
        'boxes'
      ]),
      ...mapGetters([])
    },
    methods: {
      ...mapActions([
        actions.BUY_PACK,
        actions.REDEEM_PACK
      ]),
      goHome () {
        this.$router.push({name: 'home'});
      }
    },
    props: {
      boxNumber: {
        required: true,
        type: Number,
        default: 1000000
      }
    }
  };
</script>

<style scoped lang="scss">
  $body-bg: #f2f5fb;
  $body-color: #545454;
  $primary: #545454;
  $secondary: #132cc4;

  .kota-box {
    background-image: url("../../../static/background.jpg");
    background-color: $secondary;
    color: $body-bg;
  }

  .btn-xlg {
    padding: 0.75rem 1.25rem;
    font-size: 2rem;
    line-height: 2;
  }
</style>

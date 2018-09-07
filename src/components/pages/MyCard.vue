<template>
  <div v-if="assetsPurchasedByAccount" class="row">
    <div class="col col-auto mx-auto">
      <div class="card shadow-sm">
        <img class="card-img-top" :src="`${lookupBoxCardSet(tokenId)[8].image}`" :alt="web3.utils.toAscii(lookupBoxCardSet(tokenId)[4])"/>
        <div class="card-body">
          <span class="badge badge-primary float-right">{{ tokenId.toString(10) }}</span>
          <h5 class="card-title">
            {{ web3.utils.toAscii(lookupBoxCardSet(tokenId)[4]) }}
          </h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <!--<span class="text-muted">Box</span> <span class="">{{ simpleBoxNumberFromTokenId(tokenId) }}</span> &bull;-->
            <!--<span class="text-muted">Card</span> <span class="">{{ simpleBoxCardSetNumberFromTokenId(tokenId) }}</span> &bull;-->
            <span class="text-muted small">Serial</span> <span class="float-right">#{{ boxCardSetSerialNumberFromTokenId(tokenId) }} of 100</span>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col"><span class="text-muted small">Power</span> <span class="float-right font-weight-bold">86</span></div>
              <div class="col"><span class="text-muted small">Speed</span> <span class="float-right font-weight-bold">43</span></div>
            </div>
          </li>
          <li class="list-group-item">
            <div class="row">
              <div class="col"><span class="text-muted small">Intelligence</span> <span class="float-right font-weight-bold">69</span></div>
              <div class="col"><span class="text-muted small">Moral</span> <span class="float-right font-weight-bold">77</span></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters, mapState, mapActions } from 'vuex';
  import LoadingSpinner from '../ui-controls/LoadingSpinner.vue';
  import * as actions from '../../store/actions';

  export default {
    name: 'mycard',
    components: {
      LoadingSpinner
    },
    props: ['tokenId'],
    computed: {
      ...mapState([
        'assetsPurchasedByAccount',
        'account',
        'cardSets',
        'web3'
      ]),
      ...mapGetters([
        'boxNumberFromTokenId',
        'boxCardSetNumberFromTokenId',
        'boxCardSetFromTokenId',
        'boxNumberSerialNumberFromTokenId',
        'boxCardSetSerialNumberFromTokenId',
        'cardSetFromTokenId',
        'lookupBoxCardSet',
        'simpleBoxNumberFromTokenId',
        'simpleBoxCardSetNumberFromTokenId'
      ])
    },
    methods: {
      ...mapActions([])
    }
  };
</script>

<style scoped lang="scss">
  .card {
    width: 20rem;
    border-radius: 0;
    border: 0;
  }
</style>

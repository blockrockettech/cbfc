<template>
  <div v-if="assetsPurchasedByAccount" class="row">
    <div class="col col-auto mx-auto">
      <div class="card shadow-sm">
        <img class="card-img-top" :src="`${lookupBoxCardSet(tokenId)[8].image}`" :alt="web3.utils.toAscii(lookupBoxCardSet(tokenId)[4])"/>
        <div class="card-body">
          <span class="badge badge-primary float-right">{{ tokenId.toString(10) }}</span>
          <h5 class="card-title m-3">
            {{ web3.utils.toAscii(lookupBoxCardSet(tokenId)[4]) }}
          </h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            Box <span class="">#{{ simpleBoxNumberFromTokenId(tokenId) }}</span>
          </li>
          <li class="list-group-item">
            Card <span class="">#{{ simpleBoxCardSetNumberFromTokenId(tokenId) }}</span>
          </li>
          <li class="list-group-item">
            Serial <span class="">#{{ boxCardSetSerialNumberFromTokenId(tokenId) }}</span>
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

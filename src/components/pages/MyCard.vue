<template>
  <div v-if="assetsPurchasedByAccount" class="row justify-content-sm-center">
    <div class="col col-sm-6">
      <div class="card shadow-sm mb-3">
        <img class="card-img-top" :src="`https://ipfs.infura.io/ipfs/${lookupBoxCardSet(tokenId)[4]}/image`" :alt="web3.utils.toAscii(lookupCardSet(tokenId)[3])">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title">
                Card {{ boxCardSetNumberFromTokenId(tokenId) }}
              </h5>
            </div>
            <div class="col">
              <span class="pl-3">{{ web3.utils.toAscii(lookupBoxCardSet(tokenId)[3]) }}</span>
            </div>
          </div>
          <div class="row text-center m-2">
            <div class="col">
              <span class="">#{{ cardSerialNumberFromTokenId(tokenId) }} of {{ lookupBoxCardSet(tokenId)[1].toString(10) }}</span>
            </div>
            <div class="col">
              <span class="">12 Minted</span>
            </div>
            <div class="col">
              <span class="">12 Left</span>
            </div>
          </div>
          <div class="row text-center m-2">
            <div class="col">
              Rare
            </div>
            <div class="col">
              Human
            </div>
            <div class="col">
              <span class="badge badge-primary">#{{ cardSerialNumberFromTokenId(tokenId) }} of {{ lookupBoxCardSet(tokenId)[1].toString(10) }}</span>
            </div>
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
        'boxCardSetFromTokenId',
        'boxCardSetNumberFromTokenId',
        'cardSerialNumberFromTokenId',
        'lookupBoxCardSet'
      ])
    },
    methods: {
      ...mapActions([])
    }
  };
</script>

<style scoped lang="scss">
</style>

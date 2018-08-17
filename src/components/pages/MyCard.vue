<template>
  <div v-if="assetsPurchasedByAccount" class="row justify-content-sm-center">
    <div class="col col-sm-6">
      <div class="card shadow-sm mb-3">
        <img class="card-img-top" :src="`https://ipfs.infura.io/ipfs/${lookupBoxCardSet(tokenId)[5]}/image`" :alt="web3.utils.toAscii(lookupBoxCardSet(tokenId)[4])"/>
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title">
                {{ web3.utils.toAscii(lookupBoxCardSet(tokenId)[4]) }}
                <span class="badge badge-primary float-right">{{ tokenId.toString(10) }}</span>
              </h5>
            </div>
          </div>
          <div class="row">
            <div class="col">
                BOX {{ boxNumberFromTokenId(tokenId) }}
            </div>
            <div class="col">
                CARD {{ cardSetFromTokenId(tokenId) }}
            </div>
            <div class="col">
                SERIAL #{{ boxCardSetSerialNumberFromTokenId(tokenId) }}
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span class="">XX Minted</span>
            </div>
            <div class="col">
              <span class="">XX Left</span>
            </div>
            <div class="col">
              <span class="">RARE</span>
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
        'boxNumberFromTokenId',
        'boxCardSetNumberFromTokenId',
        'boxCardSetFromTokenId',
        'boxCardSetSerialNumberFromTokenId',
        'cardSetFromTokenId',
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

<template>
  <div v-if="assetsPurchasedByAccount" class="row justify-content-sm-center">
    <div class="col col-sm-6">
      <div class="card border-primary mb-3">
        <img class="card-img-top" :src="`https://ipfs.infura.io/ipfs/${lookupCardSet(tokenId)[4]}/image`" :alt="web3.utils.toAscii(lookupCardSet(tokenId)[3])">
        <div class="card-body">
          <h5 class="card-title">
            {{ web3.utils.toAscii(lookupCardSet(tokenId)[3]) }}
            <span class="float-right">
              <span class="badge badge-primary">#{{ cardSerialNumberFromTokenId(tokenId) }} of {{ lookupCardSet(tokenId)[1].toString(10) }}</span>
            </span>
          </h5>
          <p class="card-text text-muted">Card #{{ cardSetNumberFromTokenId(tokenId) }}</p>
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
        'cardSetFromTokenId',
        'cardSetNumberFromTokenId',
        'cardSerialNumberFromTokenId',
        'lookupCardSet'
      ])
    },
    methods: {
      ...mapActions([])
    }
  };
</script>

<style scoped lang="scss">
</style>

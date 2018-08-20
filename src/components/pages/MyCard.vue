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
</style>

<template>
  <div v-if="assetsPurchasedByAccount">
    <h1 class="display-4">My Cards <span class="badge badge-primary">{{ assetsPurchasedByAccount.length }}</span></h1>
    <pre>{{ account }}</pre>
    <div class="card-columns">
      <div class="card border-primary mb-3" v-for="tokenId in assetsPurchasedByAccount">
        <img class="card-img-top" :src="`https://ipfs.infura.io/ipfs/${lookupCardSet(tokenId)[4]}/image`" :alt="web3.utils.toAscii(lookupCardSet(tokenId)[3])">
        <div class="card-footer">
          <div class="btn-group-vertical btn-block m-0">
            <router-link :to="{ name: 'mycard', params: { tokenId: tokenId} }" tag="button" class="m-1 btn btn-sm btn-outline-primary btn-block">
              View card
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters, mapState, mapActions } from 'vuex';

  export default {
    name: 'mycards',
    components: {},
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

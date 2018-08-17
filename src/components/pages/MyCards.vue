<template>
  <div v-if="assetsPurchasedByAccount">
    <h1 class="display-4 text-secondary">My KOTAs <span class="badge badge-secondary">{{ assetsPurchasedByAccount.length }}</span></h1>
    <pre class="text-muted">{{ account }}</pre>
    <div class="card-deck ml-5 mr-5">
      <div class="col-auto mx-auto" v-for="tokenId in assetsPurchasedByAccount">
        <div class="card shadow-sm mb-3">
          <router-link :to="{ name: 'mycard', params: { tokenId: tokenId} }">
            <img class="card-img-top" :src="`https://ipfs.infura.io/ipfs/${lookupBoxCardSet(tokenId)[5]}/image`" :alt="web3.utils.toAscii(lookupBoxCardSet(tokenId)[4])">
          </router-link>
          <div class="card-body"></div>
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
        'lookupBoxCardSet'
      ])
    },
    methods: {
      ...mapActions([])
    }
  };
</script>

<style scoped lang="scss">
  .card-img-top {
    /*height: 14rem;*/
  }

  .card {
    width: 10rem;
    height: 15rem;
  }
</style>

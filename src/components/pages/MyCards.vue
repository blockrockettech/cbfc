<template>
  <div v-if="assetsPurchasedByAccount">
    <h1 class="display-4 text-secondary">My KOTAs <span class="badge badge-secondary">{{ assetsPurchasedByAccount.length }}</span></h1>
    <pre class="text-muted">{{ account }}</pre>
    <div class="card-deck ml-5 mr-5">
      <div class="col-auto mx-auto" v-for="tokenId in assetsPurchasedByAccount">
        <!--<pre>{{ lookupBoxCardSet(tokenId)}}</pre>-->
        <router-link :to="{ name: 'mycard', params: { tokenId: tokenId} }">
          <div class="card shadow-sm">
            <img class="card-img-top" :src="`${lookupBoxCardSet(tokenId)[8].image}`" :alt="web3.utils.toAscii(lookupBoxCardSet(tokenId)[4])">
          </div>
        </router-link>
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
  }

  .card {
    width: 10rem;
    border-radius: 0;
    border: 0;
  }
</style>

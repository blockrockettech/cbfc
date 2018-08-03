<template>
  <div>
    <h1 class="display-4">My Cards</h1>
    <pre>{{ account }}</pre>
    <div class="card-columns">
      <div class="card border-primary mb-3" v-for="card in assetsPurchasedByAccount">
        <img class="card-img-top" :src="`https://ipfs.infura.io/ipfs/${cardSets[(parseInt(card.toString(10) / 1000) * 1000)][4]}/image`" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">
            <span class="text-muted">{{ (parseInt(card.toString(10) / 1000) * 1000) }}</span>
            <span class="float-right">
            {{ parseInt(card.toString(10) - (parseInt(card.toString(10) / 1000) * 1000)) }}
            of {{ cardSets[(parseInt(card.toString(10) / 1000) * 1000)][1].toString(10) }}
            </span>
          </h5>
          <p class="card-text">{{ web3.utils.toAscii(cardSets[(parseInt(card.toString(10) / 1000) * 1000)][3]) }}</p>
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
    name: 'mycards',
    components: {
      LoadingSpinner
    },
    computed: {
      ...mapState([
        'assetsPurchasedByAccount',
        'account',
        'cardSets',
        'web3'
      ]),
      ...mapGetters([])
    },
    methods: {
      ...mapActions([])
    }
  };
</script>

<style scoped lang="scss">
</style>

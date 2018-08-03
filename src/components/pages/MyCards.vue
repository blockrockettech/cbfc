<template>
  <div>
    <h1 class="display-4">My Cards</h1>
    <pre>{{ account }}</pre>
    <div class="card-columns">
      <div class="card border-primary mb-3" v-for="card in assetsPurchasedByAccount">
        <img class="card-img-top" src="https://placeimg.com/100/150/any" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">{{ card.toString(10) }}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
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
        'account'
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

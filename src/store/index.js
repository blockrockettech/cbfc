import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutation-types';
import _ from 'lodash';
import Web3 from 'web3';
import createLogger from 'vuex/dist/logger';
import { getEtherscanAddress, getNetIdString } from '../utils';
import contract from 'truffle-contract';

import kotaJson from '../../build/contracts/KOTA.json';

const kota = contract(kotaJson);

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createLogger()],
  state: {
    // connectivity
    web3: null,
    account: null,
    accountBalance: null,
    currentNetwork: null,
    etherscanBase: null,
    assetsPurchasedByAccount: null,

    // contract metadata
    contractName: null,
    contractSymbol: null,
    contractAddress: null,
    owner: null,

    // contract totals
    totalSupply: null,
    costOfPack: null,
    cardsPerPack: null,
    totalCardsInCirculation: null,
    totalCardsInCirculationSold: null,
  },
  getters: {},
  mutations: {
    [mutations.SET_ALL_ASSETS] (state, assets) {
      Vue.set(state, 'assets', state.assets);
    },
    [mutations.SET_ASSET] (state, asset) {
      if (!_.find(state.assets, {tokenId: asset.tokenId})) {
        state.assets.push(asset);
      }
      Vue.set(state, 'assets', state.assets);
    },
    [mutations.SET_ASSETS_PURCHASED_FROM_ACCOUNT] (state, tokens) {
      Vue.set(state, 'assetsPurchasedByAccount', tokens);
    },
    [mutations.SET_CONTRACT_DETAILS] (state, {
      name,
      symbol,
      totalSupply,
      owner,
      contractAddress,
      costOfPack,
      cardsPerPack,
      totalCardsInCirculation,
      totalCardsInCirculationSold
    }) {
      state.totalSupply = totalSupply;
      state.contractSymbol = symbol;
      state.contractName = name;
      state.owner = owner;
      state.contractAddress = contractAddress;
      state.costOfPack = costOfPack;
      state.cardsPerPack = cardsPerPack;
      state.totalCardsInCirculation = totalCardsInCirculation;
      state.totalCardsInCirculationSold = totalCardsInCirculationSold;
    },
    [mutations.SET_ACCOUNT] (state, {account, accountBalance}) {
      state.account = account;
      state.accountBalance = accountBalance;

      store.dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
    },
    [mutations.SET_CURRENT_NETWORK] (state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK] (state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3] (state, web3) {
      state.web3 = web3;
    },
  },
  actions: {
    [actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT] ({commit, dispatch, state}) {
      kota.deployed()
        .then((contract) => {
          return contract.tokensOf(state.account)
            .then((tokens) => {
              commit(mutations.SET_ASSETS_PURCHASED_FROM_ACCOUNT, tokens);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    },
    [actions.GET_CURRENT_NETWORK] ({commit, dispatch, state}) {
      getNetIdString()
        .then((currentNetwork) => {
          commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
        });
      getEtherscanAddress()
        .then((etherscanBase) => {
          commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
        });
    },
    [actions.INIT_APP] ({commit, dispatch, state}, web3) {

      // NON-ASYNC action - set web3 provider on init
      kota.setProvider(web3.currentProvider);

      // //dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
      if (typeof kota.currentProvider.sendAsync !== 'function') {
        kota.currentProvider.sendAsync = function () {
          return kota.currentProvider.send.apply(
            kota.currentProvider, arguments
          );
        };
      }

      // Set the web3 instance
      commit(mutations.SET_WEB3, web3);

      // Find current network
      dispatch(actions.GET_CURRENT_NETWORK);

      web3.eth.getAccounts()
        .then((accounts) => {

          let account = accounts[0];

          const setAccountAndBalance = (account) => {

            return web3.eth.getBalance(account)
              .then((balance) => {

                let accountBalance = Web3.utils.fromWei(balance);

                // store the account details
                commit(mutations.SET_ACCOUNT, {account, accountBalance});
              });
          };

          const refreshHandler = () => {
            web3.eth.getAccounts()
              .then((updatedAccounts) => {
                if (updatedAccounts[0] !== account) {
                  account = updatedAccounts[0];
                  return setAccountAndBalance(account);
                }
              });
          };

          // Every second check if the main account has changed
          setInterval(refreshHandler, 1000);

          // init the contract
          dispatch(actions.REFRESH_CONTRACT_DETAILS);

          if (account) {
            return setAccountAndBalance(account);
          }
        })
        .catch(function (error) {
          console.log('ERROR - account locked', error);
          // TODO handle locked metamask account
        });
    },
    [actions.REFRESH_CONTRACT_DETAILS] ({commit, dispatch, state}) {

      kota.deployed()
        .then((contract) => {

          console.log('aaaaa');

          Promise.all([
            contract.name(),
            contract.symbol(),
            contract.totalSupply(),
            contract.owner(),
            contract.address,
            contract.costOfPack(),
            contract.cardsPerPack(),
            contract.totalCardsInCirculation(),
            contract.totalCardsInCirculationSold()
          ])
            .then((results) => {
              commit(mutations.SET_CONTRACT_DETAILS, {
                name: results[0],
                symbol: results[1],
                totalSupply: results[2].toString(),
                owner: results[3],
                contractAddress: results[4],
                costOfPack: results[5],
                cardsPerPack: results[6],
                totalCardsInCirculation: results[7],
                totalCardsInCirculationSold: results[8],
              });
            })
            .catch((error) => console.log('Something went bang!', error));
        }).catch((error) => console.log('Something went bang!', error));
    },
    [actions.BUY_PACK] ({commit, dispatch, state}) {
      kota.deployed()
        .then((contract) => {
          console.log(`buying pack...`);
          let tx = contract.buyPack({value: state.costOfPack, from: state.account});

          console.log(tx);

          tx
            .then((data) => {
              console.log(data);
              setInterval(function () {
                dispatch(actions.GET_ASSETS_PURCHASED_FOR_ACCOUNT);
              }, 10000);
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
});

export default store;

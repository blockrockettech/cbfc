const KOTA = artifacts.require('KOTA');
const _ = require('lodash');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('../mnemonic');

module.exports = async function (deployer, network, accounts) {

  console.log(`KOTA adding card sets to ${network}...`);

  const deployedKOTA = await KOTA.deployed();

  let _owner = accounts[0];

  if (network === 'ropsten' || network === 'rinkeby') {
    _owner = new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApikey}`, 0).getAddress();
  }

  if (network === 'live') {
    let mnemonicLive = require('../mnemonic_live');
    _owner = new HDWalletProvider(mnemonicLive, `https://mainnet.infura.io/${infuraApikey}`, 0).getAddress();
  }

  console.log(`_owner = ${_owner}`);

  const kodaIpfsCache = {
    'coin_journal_coinfest_day': 'QmQUJkPs4keJEaJhVcpJfaivxsUYAPQPk7a8DzN26AA7Zm',
    'stina_jones_happy_fox': 'QmT9iCuqkB9i9U2KXm6YhH5bn6jY7YJwWJHMu1EAsTtB4o',
    'stina_jones_happy_friday_bird': 'QmWvF9H5ejccr5sVvvdM7Yj34pPP2iZGwkbyqQ2xvCKJka',
    'stina_jones_spring_morning': 'QmTenX8zYBzCPy3HPDWiDLMPAAjtvC4muqWDW5A1yp6BeB',
    'stina_jones_running_riot': 'QmVpFrBK5gupqGZNHCrGH65Ju79SivaeiWcsNkjCQDJLF6',
    'franky_aguilar_insta_tweety': 'Qmbdf5KBGAkNeGthdZXdqzKM6J2FLvnqv1PRh74ehxo76L',
    'franky_aguilar_martian_bang': 'QmXpsBob8uD4FxWDjh74qkY3uH4CdEy5eCyStB2YQKu7uK',
    'franky_aguilar_bunny_bags': 'QmZnxsBjuDCMr22na5qjoZFNMytG5xBexTdVC5HPQaLkFT',
    'franky_aguilar_burning_fiat': 'QmZ5aFJypwSSLbaQUwejUAUGXyuHfvV9LGMCvQQckacKAY',
    'obxium_ddf5': 'QmeEwVK34xSB6s3cBJQsvHUwDeKkjvBu2i8b9SnLjhQGQa',
    'drawingly_willingly_devilish_run': 'QmeL43j1gkKmGkmHcwmZqvevKu69LVhULDkgnsmTLP7TCQ',
    'hackatao_they_live': 'QmTbJvdAMQAPuyHiv3i6W4nDKguTQZpqfocn4YJ6Pps7H1',
    'coin_journal_coin_zuki': 'QmQvcmPP83hnvzeRnuB1oJm9E1iuoTR4VXZpVeDRj66tmK',
  };

  let index = 0;
  _.forOwn(kodaIpfsCache, async (v, k, i) => {
    ++index;
    await deployedKOTA.addCardSet(1000 * index, 100, k, v);
  });
};

const KOTA = artifacts.require('KOTA');
const _ = require('lodash');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('../mnemonic');

module.exports = async function (deployer, network, accounts) {

  console.log(`KOTA adding card sets to ${network}...`);

  const deployedKOTA = await KOTA.deployed();

  let _owner = accounts[0];
  let _artist = accounts[1];

  if (network === 'ropsten' || network === 'rinkeby') {
    _owner = new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApikey}`, 0).getAddress();
  }

  if (network === 'live') {
    let mnemonicLive = require('../mnemonic_live');
    _owner = new HDWalletProvider(mnemonicLive, `https://mainnet.infura.io/${infuraApikey}`, 0).getAddress();
  }

  console.log(`_owner = ${_owner}`);

  await deployedKOTA.addBox(1000000, 'Stina Jones', 'Specimens', 'QmT9iCuqkB9i9U2KXm6YhH5bn6jY7YJwWJHMu1EAsTtB4o', 10000000000000000, 2);
  // await deployedKOTA.addBox(2000000, 'KO', 'KO Kards', 'Qmbdf5KBGAkNeGthdZXdqzKM6J2FLvnqv1PRh74ehxo76L', 20000000000000000, 2);

};

const KOTA = artifacts.require('KOTA');
const _ = require('lodash');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('../mnemonic');

module.exports = async function (deployer, network, accounts) {

  console.log(`KOTA adding credts to ${network}...`);

  const deployedKOTA = await KOTA.deployed();

  let _owner = accounts[0];
  let _account1 = accounts[1];
  let _account2 = accounts[2];

  if (network === 'ropsten' || network === 'rinkeby') {
    _owner = new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApikey}`, 0).getAddress();
    _account1 = new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApikey}`, 1).getAddress();
    _account2 = new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApikey}`, 2).getAddress();
  }

  if (network === 'live') {
    let mnemonicLive = require('../mnemonic_live');
    _owner = new HDWalletProvider(mnemonicLive, `https://mainnet.infura.io/${infuraApikey}`, 0).getAddress();
    _account1 = new HDWalletProvider(mnemonicLive, `https://mainnet.infura.io/${infuraApikey}`, 1).getAddress();
    _account2 = new HDWalletProvider(mnemonicLive, `https://mainnet.infura.io/${infuraApikey}`, 2).getAddress();
  }

  console.log(`_owner = ${_owner}`);

  await deployedKOTA.addCredit(_account1, {from: _owner});
  await deployedKOTA.addCredit(_account2, {from: _owner});
};

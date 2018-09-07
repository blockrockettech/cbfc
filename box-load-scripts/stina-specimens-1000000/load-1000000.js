const _ = require('lodash');
const fs = require('fs');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';

const Eth = require('ethjs');
const sign = require('ethjs-signer').sign;
const SignerProvider = require('ethjs-provider-signer');

const {gas, gasPrice} = {gas: 4075039, gasPrice: 3000000000};
console.log(`gas=${gas} | gasPrice=${gasPrice}`);

(async function () {

  ////////////////////////////////
  // The network to run against //
  ////////////////////////////////

  const program = require('commander');

  program
    .option('-n, --network <n>', 'Network - either mainnet,ropsten,rinkeby,local')
    .parse(process.argv);

  if (!program.network) {
    console.log(`Please specify -n mainnet,ropsten,rinkeby or local`);
    process.exit();
  }

  const network = program.network;

  ////////////////////////////////
  // The network to run against //
  ////////////////////////////////

  const httpProviderUrl = getHttpProviderUri(network);
  console.log("httpProviderUrl", httpProviderUrl);

  const mnemonic = network === 'mainnet' ? require('../../mnemonic_live') : require('../../mnemonic');

  const wallet = new HDWalletProvider(mnemonic, httpProviderUrl, 0);
  const fromAccount = wallet.getAddress();
  console.log("fromAccount", fromAccount);
  console.log("wallet.wallets[fromAccount]", wallet.wallets[fromAccount].getPrivateKeyString());

  const provider = getSignerProvider(network, fromAccount, wallet.wallets[fromAccount].getPrivateKeyString());
  const contract = connectToKota(network, provider);

  let nonce = await getAccountNonce(network, fromAccount);

  const data = require('./data');

  let successes = [];
  let failures = [];

  let i = 0;
  let createdEditions = _.map(data, (v, k) => {
    console.log(`${k} ${v}`);
    i++;

    let result = contract.addCardSet(1000000, 1000 * i, 100, Eth.fromAscii(k), v, fromAccount, 76,
      {
        from: fromAccount,
        nonce: nonce,
        gas: gas,
        gasPrice: gasPrice
      })
      .then((success) => {
        successes.push(success);
        return success;
      })
      .catch((e) => {
        failures.push({
          data,
          error: e
        });
        return e;
      });

    console.log(result);

    // Bump nonce value
    nonce++;

    return result;
  });

  Promise.all(createdEditions)
    .then((rawTransactions) => {
      console.log(`
            Completed submitting transactions
            
                Report:
                    - Success [${successes.length}]
                    - Failures [${failures.length}]
                    - Attempts [${rawTransactions.length}]
            `);
      console.log(rawTransactions);
      process.exit();
    });

})();

async function getAccountNonce(network, account) {
  return new Eth(new Eth.HttpProvider(getHttpProviderUri(network)))
    .getTransactionCount(account);
}

function connectToKota(network, provider) {
  const buildKotaJson = require('../../build/contracts/KOTA');
  // console.log(buildKotaJson.abi);
  return new Eth(provider)
    .contract(buildKotaJson.abi)
    .at(getKotaAddress(network));
}

function getKotaAddress(network) {
  const buildKotaJson = require('../../build/contracts/KOTA');
  if (network === 'local') {
    return buildKotaJson.networks['5777'].address;
  }
  if (network === 'ropsten') {
    return buildKotaJson.networks['3'].address;
  }
}

function getHttpProviderUri(network) {
  if (network === 'local') {
    return 'HTTP://127.0.0.1:7545';
  }
  return `https://${network}.infura.io/${infuraApikey}`;
}

function getSignerProvider(network, fromAccount, privateKey) {
  if (network === 'local') {
    return new SignerProvider(`HTTP://127.0.0.1:7545`, {
      signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey)),
      accounts: (cb) => cb(null, [fromAccount]),
    });
  }

  return new SignerProvider(`https://${network}.infura.io/${infuraApikey}`, {
    signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey)),
    accounts: (cb) => cb(null, [fromAccount]),
  });
}

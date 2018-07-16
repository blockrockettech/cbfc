const assertRevert = require('../helpers/assertRevert');
const sendTransaction = require('../helpers/sendTransaction').sendTransaction;
const etherToWei = require('../helpers/etherToWei');

const advanceBlock = require('../helpers/advanceToBlock');
const increaseTimeTo = require('../helpers/increaseTime').increaseTimeTo;
const duration = require('../helpers/increaseTime').duration;
const latestTime = require('../helpers/latestTime');

const _ = require('lodash');

const BigNumber = web3.BigNumber;

const CBFC = artifacts.require('CBFC');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract.only('CBFC', function (accounts) {
  const _owner = accounts[0];

  const _buyerOne = accounts[1];
  const _buyerTwo = accounts[2];

  const unknownTokenId = 99;
  const _defaultCardSetNumberOne = 10000;
  const _defaultCardSetNumberTwo = 20000;
  const _defaultCardSetNumberThree = 30000;
  const _defaultCardSetNumberFour = 40000;

  const _defaultCardSetOneSerialNumberOne = 10001;
  const _defaultCardSetTwoSerialNumberTwo = 20002;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const RECEIVER_MAGIC_VALUE = '0xf0b9e5ba';

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await CBFC.new({from: _owner});

    await this.token.addCardSet(_defaultCardSetNumberOne, 100, 'One', 'One', {from: _owner}); // add card set
    await this.token.addCardSet(_defaultCardSetNumberTwo, 100, 'Two', 'Two', {from: _owner}); // add card set
    await this.token.addCardSet(_defaultCardSetNumberThree, 100, 'Three', 'Three', {from: _owner}); // add card set
    await this.token.addCardSet(_defaultCardSetNumberFour, 100, 'Four', 'Four', {from: _owner}); // add card set
  });

  it('should have 4 card sets in circulation', async function () {
    const numberOfSets = await this.token.cardSetsInCirculation();
    numberOfSets.should.be.bignumber.equal(4);
  });

  describe('buy packs with ether', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      _costOfPack = await this.token.costOfPack();
      _cardsPerPack = await this.token.cardsPerPack();
    });

    it('should own x cards after buying pack', async function () {
      await this.token.buyPack({value: _costOfPack, from: _buyerOne});

      const balance = await this.token.balanceOf(_buyerOne);
      balance.should.be.bignumber.equal(4);
    });
  });
});

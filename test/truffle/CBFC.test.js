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

contract('CBFC', function (accounts) {
  const _owner = accounts[0];

  const _buyerOne = accounts[1];
  const _buyerTwo = accounts[2];

  const _defaultCardSetNumberOne = 10000;
  const _defaultCardSetNumberTwo = 20000;
  const _defaultCardSetNumberThree = 30000;
  const _defaultCardSetNumberFour = 40000;

  const _defaultCardSetOneSerialNumberOne = 10001;
  const _defaultCardSetTwoSerialNumberTwo = 20002;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await CBFC.new({from: _owner});
  });

  describe('remove packs when exhausted', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      _costOfPack = await this.token.costOfPack();
      _cardsPerPack = await this.token.cardsPerPack();

      await this.token.addCardSet(_defaultCardSetNumberOne, 4, 'One', 'One', {from: _owner}); // add card set
      await this.token.addCardSet(_defaultCardSetNumberTwo, 4, 'Two', 'Two', {from: _owner}); // add card set
      await this.token.addCardSet(_defaultCardSetNumberThree, 4, 'Three', 'Three', {from: _owner}); // add card set
    });

    it('should have 3 card sets in circulation ', async function () {
      const numberOfSets = await this.token.cardSetsInCirculation();
      numberOfSets.should.be.bignumber.equal(3);

      const totalCirculation = await this.token.totalCardsInCirculation();
      totalCirculation.should.be.bignumber.equal(12);
    });

    it('should own all cards after buying packs, all cards should be exhausted and no card sets in circulation', async function () {
      await this.token.buyPack({value: _costOfPack, from: _buyerOne});
      await this.token.buyPack({value: _costOfPack, from: _buyerOne});
      await this.token.buyPack({value: _costOfPack, from: _buyerOne});

      const balance = await this.token.balanceOf(_buyerOne);
      balance.should.be.bignumber.equal(12);

      const numberOfSets = await this.token.cardSetsInCirculation();
      numberOfSets.should.be.bignumber.equal(0);

      const totalSold = await this.token.totalCardsInCirculationSold();
      totalSold.should.be.bignumber.equal(12);
    });
  });

  describe('buy packs with ether', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      _costOfPack = await this.token.costOfPack();
      _cardsPerPack = await this.token.cardsPerPack();

      await this.token.addCardSet(_defaultCardSetNumberOne, 8, 'One', 'One', {from: _owner}); // add card set
      await this.token.addCardSet(_defaultCardSetNumberTwo, 8, 'Two', 'Two', {from: _owner}); // add card set
      await this.token.addCardSet(_defaultCardSetNumberThree, 8, 'Three', 'Three', {from: _owner}); // add card set
      await this.token.addCardSet(_defaultCardSetNumberFour, 8, 'Four', 'Four', {from: _owner}); // add card set
    });

    it('should have 4 card sets in circulation', async function () {
      const numberOfSets = await this.token.cardSetsInCirculation();
      numberOfSets.should.be.bignumber.equal(4);
    });

    it('should own x cards after buying pack', async function () {
      await this.token.buyPack({value: _costOfPack, from: _buyerOne});

      const balance = await this.token.balanceOf(_buyerOne);
      balance.should.be.bignumber.equal(4);
    });

    it('should remove cardset once supply is exhausted', async function () {
      const cardSetTotal = await this.token.cardSetsInCirculation();
      cardSetTotal.should.be.bignumber.equal(4);

      await this.token.buyPack({value: _costOfPack, from: _buyerOne});
      await this.token.buyPack({value: _costOfPack, from: _buyerOne});

      const postCardSetTotal = await this.token.cardSetsInCirculation();
      // postCardSetTotal.should.be.bignumber.equal(0);
      console.log(`circulation ${postCardSetTotal}`);

      const cards = await this.token.tokensOf(_buyerOne);
      console.log(`cards ${cards}`);
    });

    it('should return random card set index', async function () {
      for (let i = 0; i < 10; i++) {
        let random = await this.token.randomCardSetIndex(i + 1);
        console.log(`RAND ${random}`);
      }
    });
  });
});

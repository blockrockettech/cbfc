const assertRevert = require('../helpers/assertRevert');
const sendTransaction = require('../helpers/sendTransaction').sendTransaction;
const etherToWei = require('../helpers/etherToWei');

const advanceBlock = require('../helpers/advanceToBlock');

const _ = require('lodash');

const BigNumber = web3.BigNumber;

const KOTA = artifacts.require('KOTA');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract.only('KOTA', function (accounts) {
  const _owner = accounts[0];

  const _buyerOne = accounts[1];
  const _buyerTwo = accounts[2];

  const _boxOne = 1000000;
  const _boxTwo = 2000000;

  const _cardSetNumberOne = 1000;
  const _cardSetNumberTwo = 2000;
  const _cardSetNumberThree = 3000;
  const _cardSetNumberFour = 4000;

  const _cardSetOneSerialNumberOne = 1001;
  const _cardSetTwoSerialNumberTwo = 2002;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await KOTA.new({from: _owner});
  });

  describe('remove packs when exhausted', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      _costOfPack = await this.token.costOfPack();
      _cardsPerPack = await this.token.cardsPerPack();

      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 4, 'One', 'One', {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 4, 'Two', 'Two', {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberThree, 4, 'Three', 'Three', {from: _owner}); // add card set
    });

    it('should have 3 card sets in circulation ', async function () {
      const numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
      numberOfSets.should.be.bignumber.equal(3);

      const totalCardNumbers = await this.token.cardNumbersOf(_boxOne);
      totalCardNumbers.should.be.bignumber.equal(3);

      const totalCirculation = await this.token.totalCardsInCirculation();
      totalCirculation.should.be.bignumber.equal(12);
    });

    it('should own all cards after buying packs, all cards should be exhausted and no card sets in circulation', async function () {
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});

      const balance = await this.token.balanceOf(_buyerOne);
      balance.should.be.bignumber.equal(12);

      const numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
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

      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, 'One', 'One', {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 8, 'Two', 'Two', {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberThree, 8, 'Three', 'Three', {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberFour, 8, 'Four', 'Four', {from: _owner}); // add card set
    });

    it('should have 4 card sets in circulation', async function () {
      const numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
      numberOfSets.should.be.bignumber.equal(4);
    });

    it('should own x cards after buying pack', async function () {
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});

      const balance = await this.token.balanceOf(_buyerOne);
      balance.should.be.bignumber.equal(4);
    });

    it('should remove cardset once supply is exhausted', async function () {
      const cardSetTotal = await this.token.cardSetsInCirculation(_boxOne);
      cardSetTotal.should.be.bignumber.equal(4);

      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});

      const postCardSetTotal = await this.token.cardSetsInCirculation(_boxOne);
      // postCardSetTotal.should.be.bignumber.equal(0);
      console.log(`circulation ${postCardSetTotal}`);

      const cards = await this.token.tokensOf(_buyerOne);
      console.log(`cards ${cards}`);
    });

    // it('should return random card set index', async function () {
    //   for (let i = 0; i < 10; i++) {
    //     let random = await this.token.randomCardSetIndex(i + 1);
    //     console.log(`RAND ${random}`);
    //   }
    // });
  });

  describe('owner minting', function () {

    let _costOfPack;
    let _cardsPerPack;

    beforeEach(async function () {
      _costOfPack = await this.token.costOfPack();
      _cardsPerPack = await this.token.cardsPerPack();

      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, 'One', 'One', {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 8, 'Two', 'Two', {from: _owner}); // add card set
    });

    it('should allow owner to mint', async function () {
      await this.token.mint(_buyerOne, _boxOne, _cardSetNumberOne, {from: _owner});
      const tokens = await this.token.tokensOf(_buyerOne);

      tokens.length.should.be.equal(1);
      tokens[0].should.be.bignumber.equal(_boxOne + _cardSetNumberOne + 1);
    });

  });
});

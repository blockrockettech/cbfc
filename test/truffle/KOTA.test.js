const assertRevert = require('../helpers/assertRevert');
const etherToWei = require('../helpers/etherToWei');
const bytes32ToString = require('../helpers/bytes32ToString');
const bytes32ToStringReplaceNull = require('../helpers/bytes32ToStringReplaceNull');

const BigNumber = web3.BigNumber;

const KOTA = artifacts.require('KOTA');

const _ = require('lodash');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract.only('KOTA', function (accounts) {
  const _owner = accounts[0];

  const _buyerOne = accounts[1];
  const _buyerTwo = accounts[2];
  const _artist = accounts[3];

  const _boxOne = 1000000;
  const _boxTwo = 2000000;

  const _cardSetNumberOne = 1000;
  const _cardSetNumberTwo = 2000;
  const _cardSetNumberThree = 3000;
  const _cardSetNumberFour = 4000;

  const _cardSetNumberOneSerialOne = 1001001;
  const _cardSetNumberOneCardOneName = 'OneName';
  const _cardSetNumberOneCardUri = '0nE';

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  before(async function () {});

  beforeEach(async function () {
    this.token = await KOTA.new({from: _owner});
    await this.token.addBox(_boxOne, 'Box One', 'One Desc', 'abc', 1, 4, {from: _owner});
    await this.token.addBox(_boxTwo, 'Box Two', 'Two Desc', 'xyz', 2, 2, {from: _owner});
  });

  describe('ensure boxes can be added', function () {
    it('should have 2 boxes in circulation', async function () {
      const numberOfBoxes = await this.token.allBoxNumbers();
      numberOfBoxes.length.should.be.equal(2);

      // ensure boxes in all boxes array
      numberOfBoxes.map(bn => bn.toNumber()).indexOf(_boxOne).should.be.greaterThan(-1);
      numberOfBoxes.map(bn => bn.toNumber()).indexOf(_boxTwo).should.be.greaterThan(-1);
    });

    it('should revert if not owner', async function () {
      await assertRevert(this.token.addBox(_boxOne, 'Box One', 'One Desc', 'abc', 1, 1, {from: _buyerOne}));
    });

    it('should list all boxes', async function () {
      let allBoxNumbers = await this.token.allBoxNumbers();

      allBoxNumbers = _.sortBy(allBoxNumbers, (c) => c.toNumber());
      allBoxNumbers = _.map(allBoxNumbers, (c) => c.toNumber());

      const expectedBoxNumberssInOrder = [_boxOne, _boxTwo];

      allBoxNumbers.should.be.eql(expectedBoxNumberssInOrder); // deep equals of array
    });

    it('should have fully described boxes', async function () {
      const boxOne = await this.token.boxNumberToBox(_boxOne);

      boxOne[0].toNumber().should.be.equal(_boxOne);
      boxOne[1].should.be.equal('Box One');
      boxOne[2].should.be.equal('One Desc');
      boxOne[3].should.be.equal('abc');
      boxOne[4].should.be.bignumber.equal(1);
      boxOne[5].should.be.bignumber.equal(4);

      const boxTwo = await this.token.boxNumberToBox(_boxTwo);

      boxTwo[0].toNumber().should.be.equal(_boxTwo);
      boxTwo[1].should.be.equal('Box Two');
      boxTwo[2].should.be.equal('Two Desc');
      boxTwo[3].should.be.equal('xyz');
      boxTwo[4].should.be.bignumber.equal(2);
      boxTwo[5].should.be.bignumber.equal(2);
    });
  });

  describe('ensure all cards in card sets can be purchased and counters updated', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 4, _cardSetNumberOneCardOneName, _cardSetNumberOneCardUri, _artist, 76, {from: _owner}); // add card set

      const _boxOneData = await this.token.boxNumberToBox(_boxOne);
      _costOfPack = _boxOneData[4];
      _cardsPerPack = _boxOneData[5];
    });

    it('should purchase all cards', async function () {
      let cardSetOne = await this.token.boxCardNumberToCardSet(_boxOne + _cardSetNumberOne);

      cardSetOne[2].toNumber().should.be.equal(4); // totalSupply
      cardSetOne[3].toNumber().should.be.equal(0); // minted

      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});

      const cardsInCirc = await this.token.cardSetsInCirculation(_boxOne);
      cardsInCirc.should.be.bignumber.equal(0);

      cardSetOne = await this.token.boxCardNumberToCardSet(_boxOne + _cardSetNumberOne);
      cardSetOne[2].toNumber().should.be.equal(4); // totalSupply
      cardSetOne[3].toNumber().should.be.equal(4); // minted
    });
  });

  describe('ensure card sets can be added', function () {

    beforeEach(async function () {
      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, _cardSetNumberOneCardOneName, _cardSetNumberOneCardUri, _artist, 76, {from: _owner}); // add card set
    });

    it('should have 2 card sets in circulation', async function () {
      const cardSetsForBox = await this.token.cardNumbersOf(_boxOne);
      cardSetsForBox.length.should.be.equal(1);

      const cardSetsCirculationForBox = await this.token.cardSetsInCirculation(_boxOne);
      cardSetsCirculationForBox.should.be.bignumber.equal(1);

      // ensure boxes in all boxes array
      cardSetsForBox.map(bn => bn.toNumber()).indexOf(_cardSetNumberOne).should.be.greaterThan(-1);
    });

    it('should have fully described card sets', async function () {
      const cardSetOne = await this.token.boxCardNumberToCardSet(_boxOne + _cardSetNumberOne);

      cardSetOne[0].toNumber().should.be.equal(_boxOne);
      cardSetOne[1].toNumber().should.be.equal(_cardSetNumberOne);
      cardSetOne[2].toNumber().should.be.equal(8);
      cardSetOne[3].toNumber().should.be.equal(0);
      bytes32ToStringReplaceNull(cardSetOne[4]).should.be.equal(`${_cardSetNumberOneCardOneName}`);
      cardSetOne[5].should.be.equal(_cardSetNumberOneCardUri);
      cardSetOne[6].should.be.equal(_artist);
      cardSetOne[7].should.be.bignumber.equal(76);
    });

    it('should have correct circulation and sold totals for card sets', async function () {
      const boxCirculation = await this.token.boxNumberToCardsInCirculation(_boxOne);
      boxCirculation.should.be.bignumber.equal(8);

      const boxCirculationSold = await this.token.boxNumberToCardsInCirculationSold(_boxOne);
      boxCirculationSold.should.be.bignumber.equal(0);
    });
  });

  describe('buy packs with ether', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, _cardSetNumberOneCardOneName, _cardSetNumberOneCardUri, _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 8, 'Two', 'Two', _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberThree, 8, 'Three', 'Three', _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberFour, 8, 'Four', 'Four', _artist, 76, {from: _owner}); // add card set

      const _boxOneData = await this.token.boxNumberToBox(_boxOne);
      _costOfPack = _boxOneData[4];
      _cardsPerPack = _boxOneData[5];
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

    // FIXME
    it('should remove cardset once supply is exhausted', async function () {
      const cardSetTotal = await this.token.cardSetsInCirculation(_boxOne);
      cardSetTotal.should.be.bignumber.equal(4);

      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});

      const postCardSetTotal = await this.token.cardSetsInCirculation(_boxOne);
      // postCardSetTotal.should.be.bignumber.equal(0);
      console.log(`circulation ${postCardSetTotal}`);

      const cards = await this.token.tokensOf(_buyerOne);
      // console.log(`cards ${cards}`);
    });

    // it('should return random card set index', async function () {
    //   for (let i = 0; i < 10; i++) {
    //     let random = await this.token.randomCardSetIndex(i + 1);
    //     console.log(`RAND ${random}`);
    //   }
    // });
  });

  describe.only('buy packs via default function', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {
      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, _cardSetNumberOneCardOneName, _cardSetNumberOneCardUri, _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 8, 'Two', 'Two', _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberThree, 8, 'Three', 'Three', _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberFour, 8, 'Four', 'Four', _artist, 76, {from: _owner}); // add card set

      const _boxOneData = await this.token.boxNumberToBox(_boxOne);
      _costOfPack = _boxOneData[4];
      _cardsPerPack = _boxOneData[5];
    });

    it('should have 4 card sets in circulation', async function () {
      const numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
      numberOfSets.should.be.bignumber.equal(4);
    });


    it('should own x cards after buying pack (via default method)', async function () {
      await this.token.send(_costOfPack);

      const balance = await this.token.balanceOf(_owner);
      balance.should.be.bignumber.equal(4);
    });
  });

  describe('remove packs when exhausted', function () {

    let _costOfPack;
    let _cardsPerPack;
    beforeEach(async function () {

      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 4, _cardSetNumberOneCardOneName, _cardSetNumberOneCardUri, _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 4, 'Two', 'Two', _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberThree, 4, 'Three', 'Three', _artist, 76, {from: _owner}); // add card set

      const _boxOneData = await this.token.boxNumberToBox(_boxOne);
      _costOfPack = _boxOneData[4];
      _cardsPerPack = _boxOneData[5];
    });

    it('should have 3 card sets in circulation ', async function () {
      const numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
      numberOfSets.should.be.bignumber.equal(3);

      const totalCardNumbers = await this.token.cardNumbersOf(_boxOne);
      totalCardNumbers.length.should.be.bignumber.equal(3);

      const totalCirculation = await this.token.totalCardsInCirculation();
      totalCirculation.should.be.bignumber.equal(12);
    });

    it('should own all cards after buying packs, all cards should be exhausted and no card sets in circulation', async function () {
      let numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
      numberOfSets.should.be.bignumber.equal(3);

      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});
      await this.token.buyPack(_boxOne, {value: _costOfPack, from: _buyerOne});

      const totalWei = await this.token.totalWei();
      totalWei.should.be.bignumber.equal(_costOfPack.mul(3));

      const balance = await this.token.balanceOf(_buyerOne);
      balance.should.be.bignumber.equal(12);

      numberOfSets = await this.token.cardSetsInCirculation(_boxOne);
      numberOfSets.should.be.bignumber.equal(0);

      const totalSold = await this.token.totalCardsInCirculationSold();
      totalSold.should.be.bignumber.equal(12);

      const allCards = await this.token.tokensOf(_buyerOne);
      let allCardsNumbers = _.sortBy(allCards, (c) => c.toNumber());
      allCardsNumbers = _.map(allCardsNumbers, (c) => c.toNumber());

      const expectedCardNumbersInOrder = [
        1001001,
        1001002,
        1001003,
        1001004,
        1002001,
        1002002,
        1002003,
        1002004,
        1003001,
        1003002,
        1003003,
        1003004
      ];

      allCardsNumbers.should.be.eql(expectedCardNumbersInOrder); // deep equals of array
    });
  });

  describe('owner minting', function () {

    let _costOfPack;
    let _cardsPerPack;

    beforeEach(async function () {
      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, _cardSetNumberOneCardOneName, _cardSetNumberOneCardUri, _artist, 76, {from: _owner}); // add card set
      await this.token.addCardSet(_boxOne, _cardSetNumberTwo, 8, 'Two', 'Two', _artist, 76, {from: _owner}); // add card set

      const _boxOneData = await this.token.boxNumberToBox(_boxOne);
      _costOfPack = _boxOneData[4];
      _cardsPerPack = _boxOneData[5];
    });

    it('should allow owner to mint', async function () {
      await this.token.mint(_buyerOne, _boxOne, _cardSetNumberOne, {from: _owner});
      const tokens = await this.token.tokensOf(_buyerOne);

      tokens.length.should.be.equal(1);
      tokens[0].should.be.bignumber.equal(_boxOne + _cardSetNumberOne + 1);
    });

  });

  describe('credits', function () {

    beforeEach(async function () {
      await this.token.addCardSet(_boxOne, _cardSetNumberOne, 8, 'One', 'One', _artist, 76, {from: _owner}); // add card set
    });

    it('should have no credits initially', async function () {
      const credits = await this.token.creditsOf(_boxOne, _owner);
      credits.should.be.bignumber.equal(0);
    });

    it('should award a credit and be available in credit balance', async function () {
      let credits = await this.token.creditsOf(_boxOne, _owner);
      credits.should.be.bignumber.equal(0);

      await this.token.addCredit(_boxOne, _buyerOne, {from: _owner});

      credits = await this.token.creditsOf(_boxOne, _buyerOne);
      credits.should.be.bignumber.equal(1);
    });

    it('should only allow owner to add credits', async function () {
      await this.token.addCredit(_boxOne, _artist, {from: _owner});

      await assertRevert(this.token.addCredit(_boxOne, _artist, {from: _artist}));
    });

    it('should decrement if redeemed', async function () {
      await this.token.addCredit(_boxOne, _buyerOne, {from: _owner});

      let credits = await this.token.creditsOf(_boxOne, _buyerOne);
      credits.should.be.bignumber.equal(1);

      await this.token.redeemPack(_boxOne, {from: _buyerOne});
      credits = await this.token.creditsOf(_boxOne, _buyerOne);
      credits.should.be.bignumber.equal(0);
    });

    it('should not redeem if not credit', async function () {
      let credits = await this.token.creditsOf(_boxOne, _buyerOne);
      credits.should.be.bignumber.equal(0);

      await assertRevert(this.token.redeemPack(_boxOne, {from: _buyerOne}));
    });
  });

  describe('getter, setters, utilities', function () {

    beforeEach(async function () {
      await this.token.addCardSet(
        _boxOne,
        _cardSetNumberOne,
        8,
        _cardSetNumberOneCardOneName,
        _cardSetNumberOneCardUri,
        _artist,
        76,
        {from: _owner}
      ); // add card set
    });

    it('should have tokens', async function () {
      await this.token.mint(_buyerOne, _boxOne, _cardSetNumberOne, {from: _owner});
      const hasTokens = await this.token.hasTokens(_buyerOne);
      hasTokens.should.be.equal(true);
    });

    it('should have tokenURI', async function () {
      await this.token.mint(_buyerOne, _boxOne, _cardSetNumberOne, {from: _owner});
      const tokenUri = await this.token.tokenURI(_cardSetNumberOneSerialOne);
      tokenUri.should.be.equal(`https://ipfs.infura.io/ipfs/${_cardSetNumberOneCardUri}`);
    });

    it('should set baseTokenURI', async function () {
      await this.token.mint(_buyerOne, _boxOne, _cardSetNumberOne, {from: _owner});
      const tokenUri = await this.token.tokenURI(_cardSetNumberOneSerialOne);
      tokenUri.should.be.equal(`https://ipfs.infura.io/ipfs/${_cardSetNumberOneCardUri}`);

      await this.token.setTokenBaseURI('https://abc.xyz/');

      const newTokenUri = await this.token.tokenURI(_cardSetNumberOneSerialOne);
      newTokenUri.should.be.equal(`https://abc.xyz/${_cardSetNumberOneCardUri}`);
    });

    it('should set defaultBoxNumber', async function () {
      const defaultBoxNumber = await this.token.defaultBoxNumber();
      defaultBoxNumber.should.be.bignumber.equal(1000000);

      await this.token.setDefaultBoxNumber(2000000);

      const newDefaultBoxNumber = await this.token.defaultBoxNumber();
      newDefaultBoxNumber.should.be.bignumber.equal(2000000);
    });
  });
});

const assertRevert = require('../helpers/assertRevert');
const sendTransaction = require('../helpers/sendTransaction').sendTransaction;
const etherToWei = require('../helpers/etherToWei');

const advanceBlock = require('../helpers/advanceToBlock');
const increaseTimeTo = require('../helpers/increaseTime').increaseTimeTo;
const duration = require('../helpers/increaseTime').duration;
const latestTime = require('../helpers/latestTime');

// const shouldBehaveLikeERC721BasicToken = require('./ERC721BasicToken.behaviour');
// const shouldMintAndBurnERC721Token = require('./ERC721MintBurn.behaviour');
const _ = require('lodash');

const BigNumber = web3.BigNumber;
const CBFC = artifacts.require('CBFC');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract.only('ERC721Token', function (accounts) {
  const _owner = accounts[0];

  const _cardSetOne = 10000;
  const _cardSetTwo = 20000;

  const _cardSetOneSerialNumberOne = 10001;
  const _cardSetOneSerialNumberTwo = 10002;
  const _cardSetTwoSerialNumberOne = 20001;
  const _cardSetTwoSerialNumberTwo = 20002;

  const name = "Crypto-Bands-FC";
  const symbol = "CBFC";

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await CBFC.new({from: _owner});

    await this.token.addCardSet(_cardSetOne, 10, 'One', 'One', {from: _owner}); // add card set with supply of 10
    await this.token.addCardSet(_cardSetTwo, 10, 'Two', 'Two', {from: _owner}); // add card set with supply of 10
  });

  // shouldBehaveLikeERC721BasicToken(accounts);
  // shouldMintAndBurnERC721Token(accounts);

  describe('like a full ERC721', function () {
    beforeEach(async function () {
      await this.token.mint(_owner, _cardSetOne, {from: _owner}); // creates serial 1 of card set 10000 = 10001
      await this.token.mint(_owner, _cardSetTwo, {from: _owner}); // creates serial 1 of card set 20000 = 20001
    });

    describe('mint', function () {
      const to = accounts[1];
      const tokenId = _cardSetOneSerialNumberTwo;

      beforeEach(async function () {
        await this.token.mint(to, _cardSetOne);
      });

      it('adjusts owner tokens by index', async function () {
        const token = await this.token.tokenOfOwnerByIndex(to, 0);
        token.toNumber().should.be.equal(tokenId);
      });

      it('adjusts all tokens list', async function () {
        const newToken = await this.token.tokenByIndex(2);
        newToken.toNumber().should.be.equal(tokenId);
      });
    });

    describe('burn', function () {
      const tokenId = _cardSetOneSerialNumberOne;
      const sender = _owner;

      beforeEach(async function () {
        await this.token.burn(tokenId, {from: sender});
      });

      it('removes that token from the token list of the owner', async function () {
        const token = await this.token.tokenOfOwnerByIndex(sender, 0);
        token.toNumber().should.be.equal(_cardSetTwoSerialNumberOne);
      });

      it('adjusts all tokens list', async function () {
        const token = await this.token.tokenByIndex(0);
        token.toNumber().should.be.equal(_cardSetTwoSerialNumberOne);
      });

      it('burns all tokens', async function () {
        await this.token.burn(_cardSetTwoSerialNumberOne, {from: sender});
        const total = await this.token.totalSupply();
        total.toNumber().should.be.equal(0);
        await assertRevert(this.token.tokenByIndex(0));
      });
    });

    describe('metadata', function () {
      const sampleUri = 'mock://mytoken';

      it('has a name', async function () {
        const tokenName = await this.token.name();
        tokenName.should.be.equal(name);
      });

      it('has a symbol', async function () {
        const tokenSymbol = await this.token.symbol();
        tokenSymbol.should.be.equal(symbol);
      });

      it('returns metadata for a token id', async function () {
        const uri = await this.token.tokenURI(_cardSetOneSerialNumberOne);
        uri.should.be.equal("https://ipfs.infura.io/ipfs/" + "One");
      });

      it('can burn token with metadata', async function () {
        await this.token.burn(_cardSetOneSerialNumberOne);
        const exists = await this.token.exists(_cardSetOneSerialNumberOne);
        exists.should.be.false;
      });

      it('reverts when querying metadata for non existant token id', async function () {
        await assertRevert(this.token.tokenURI(500));
      });
    });

    describe('totalSupply', function () {
      it('returns total token supply', async function () {
        const totalSupply = await this.token.totalSupply();
        totalSupply.should.be.bignumber.equal(2);
      });
    });

    describe('tokenOfOwnerByIndex', function () {
      const owner = _owner;
      const another = accounts[1];

      describe('when the given index is lower than the amount of tokens owned by the given address', function () {
        it('returns the token ID placed at the given index', async function () {
          const tokenId = await this.token.tokenOfOwnerByIndex(owner, 0);
          tokenId.should.be.bignumber.equal(_cardSetOneSerialNumberOne);
        });
      });

      describe('when the index is greater than or equal to the total tokens owned by the given address', function () {
        it('reverts', async function () {
          await assertRevert(this.token.tokenOfOwnerByIndex(owner, 2));
        });
      });

      describe('when the given address does not own any token', function () {
        it('reverts', async function () {
          await assertRevert(this.token.tokenOfOwnerByIndex(another, 0));
        });
      });

      describe('after transferring all tokens to another user', function () {
        beforeEach(async function () {
          await this.token.transferFrom(owner, another, _cardSetOneSerialNumberOne, {from: owner});
          await this.token.transferFrom(owner, another, _cardSetTwoSerialNumberOne, {from: owner});
        });

        it('returns correct token IDs for target', async function () {
          const count = await this.token.balanceOf(another);
          count.toNumber().should.be.equal(2);
          const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenOfOwnerByIndex(another, i)));
          tokensListed.map(t => t.toNumber()).should.have.members([_cardSetOneSerialNumberOne, _cardSetTwoSerialNumberOne]);
        });

        it('returns empty collection for original owner', async function () {
          const count = await this.token.balanceOf(owner);
          count.toNumber().should.be.equal(0);
          await assertRevert(this.token.tokenOfOwnerByIndex(owner, 0));
        });
      });
    });

    describe('tokenByIndex', function () {
      it('should return all tokens', async function () {
        const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenByIndex(i)));
        tokensListed.map(t => t.toNumber()).should.have.members([_cardSetOneSerialNumberOne, _cardSetTwoSerialNumberOne]);
      });

      it('should revert if index is greater than supply', async function () {
        await assertRevert(this.token.tokenByIndex(2));
      });

      [_cardSetOneSerialNumberOne, _cardSetTwoSerialNumberOne].forEach(function (tokenId) {
        it(`should return all tokens after burning token ${tokenId} and minting new tokens`, async function () {
          const owner = accounts[0];

          await this.token.burn(tokenId, {from: owner});
          await this.token.mint(owner, _cardSetOne, {from: owner});
          await this.token.mint(owner, _cardSetTwo, {from: owner});

          const count = await this.token.totalSupply();
          count.toNumber().should.be.equal(3);

          const tokensListed = await Promise.all(_.range(3).map(i => this.token.tokenByIndex(i)));
          const expectedTokens = _.filter(
            [_cardSetOneSerialNumberOne, _cardSetTwoSerialNumberOne, _cardSetOneSerialNumberTwo, _cardSetTwoSerialNumberTwo],
            x => (x !== tokenId)
          );
          tokensListed.map(t => t.toNumber()).should.have.members(expectedTokens);
        });
      });
    });
  });
});

pragma solidity ^0.4.24;

import "./Strings.sol";

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

/**
* @title CBFC aka Crypto-Bands-FC
*/
contract CBFC is ERC721Token, Ownable {
  using SafeMath for uint256;

  event CardMinted(address indexed _owner, uint256 indexed _tokenId, bytes32 _name, uint32 _mintTime);
  event CardSetSoldOut(uint256 indexed _cardNumber, uint32 _soldOutTime);
  event CardPackBought(address indexed _owner, uint32 _boughtTime);
  event CardPackRedeemed(address indexed _owner, uint32 _giftTime);

  string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public costOfPack = 0.01 ether;
  uint8 constant public cardsPerPack = 4;

  uint256 public totalCardsInCirculation = 0;
  uint256 public totalCardsInCirculationSold = 0;

  mapping(address => uint) public credits;

  struct CardSet {
    uint256 cardNumber;
    uint256 totalSupply;
    uint256 minted;
    bytes32 cardName;
    string cardURI;
  }

  mapping(uint256 => CardSet) public cardSets;

  CardSet[] public cardSetCirculation;

  function CBFC() public ERC721Token("Crypto-Bands-FC", "CBFC") {
  }

  // can buy direct from contract if you send enough ether
  function() public payable {
    buyPack();
  }

  function addCardSet(uint256 _cardNumber, uint256 _totalSupply, bytes32 _cardName, string _cardUri) public onlyOwner {
    CardSet memory newCardSet = CardSet(_cardNumber, _totalSupply, 0, _cardName, _cardUri);
    cardSets[_cardNumber] = newCardSet;
    cardSetCirculation.push(newCardSet);

    totalCardsInCirculation = totalCardsInCirculation.add(_totalSupply);
  }

  /**
   * @dev Buys a pack of CBFC cards
   */
  function buyPack() public payable {
    require(msg.value >= costOfPack);

    // thanks CryptoStrikers!
    require(msg.sender == tx.origin);

    for (uint i = 0; i < cardsPerPack; i++) {
      uint _index = randomCardSetIndex(i + 1);
      CardSet storage pickedSet = cardSetCirculation[_index];

      _mint(pickedSet);

      // remove from circulation if minted == totalSupply
      if (pickedSet.minted == pickedSet.totalSupply) {
        _removeCardSetAtIndex(_index);
        CardSetSoldOut(pickedSet.cardNumber, uint32(now));
      }
    }

    totalCardsInCirculationSold = totalCardsInCirculationSold.add(cardsPerPack);

    // reconcile payments
    owner.transfer(costOfPack);

    // give back the change - if any
    msg.sender.transfer(msg.value - costOfPack);
    CardPackBought(msg.sender, uint32(now));
  }

  /**
   * @dev Redeem a pack of CBFC cards (via a credit)
   */
  function redeemPack() public {
    require(credits[msg.sender] > 0);

    // thanks CryptoStrikers!
    require(msg.sender == tx.origin);

    for (uint i = 0; i < cardsPerPack; i++) {
      uint _index = randomCardSetIndex(i + 1);
      CardSet storage pickedSet = cardSetCirculation[_index];

      _mint(pickedSet);

      // remove from circulation if minted == totalSupply
      if (pickedSet.minted == pickedSet.totalSupply) {
        _removeCardSetAtIndex(_index);
        CardSetSoldOut(pickedSet.cardNumber, uint32(now));
      }
    }

    totalCardsInCirculationSold = totalCardsInCirculationSold.add(cardsPerPack);
    CardPackRedeemed(msg.sender, uint32(now));
  }

  /**
   * @dev Buys a pack of CBFC cards
   * @param _cardNumber card number of the card set to transfer
   */
  function transferCard(uint256 _cardNumber) public onlyOwner {
    CardSet storage cardSet = cardSets[_cardNumber];

    // don't transfer last card!
    // buyPack removes from circulation via index - we don't know index here...
    require(cardSet.minted.add(1) < cardSet.totalSupply);

    totalCardsInCirculationSold = totalCardsInCirculationSold.add(1);

    _mint(cardSet);
  }

  function _mint(CardSet storage _cardSet) internal {
    // ensure valid card set
    require(_cardSet.totalSupply > 0);
    require(_cardSet.minted <= _cardSet.totalSupply);

    _cardSet.minted = _cardSet.minted.add(1);
    uint256 cardSerialNumber = _cardSet.cardNumber.add(_cardSet.minted);

    super._mint(msg.sender, cardSerialNumber);
    CardMinted(msg.sender, cardSerialNumber, _cardSet.cardName, uint32(now));
  }

  function _removeCardSetAtIndex(uint256 _index) internal {
    uint lastIndex = cardSetCirculation.length - 1;
    require(_index <= lastIndex);

    cardSetCirculation[_index] = cardSetCirculation[lastIndex];
    cardSetCirculation.length--;
  }

  /**
   * @dev Return owned tokens
   * @param _owner address to query
   */
  function tokensOf(address _owner) public view returns (uint256[] _tokenIds) {
    return ownedTokens[_owner];
  }

  /**
   * @dev number of card sets
   */
  function cardSetsInCirculation() public view returns (uint256 _cardSetCirculationLength) {
    return cardSetCirculation.length;
  }

  /**
   * @dev checks for owned tokens
   * @param _owner address to query
   */
  function hasTokens(address _owner) public constant returns (bool) {
    return ownedTokens[_owner].length > 0;
  }

  /**
   * @dev Utility function changing the cost of the pack
   * @dev Reverts if not called by owner
   * @param _costOfPack cost in wei
   */
  function setCostOfPack(uint256 _costOfPack) external onlyOwner {
    costOfPack = _costOfPack;
  }

  /**
   * @dev Utility function to credit address with packs they can redeem
   * @dev Reverts if not called by owner
   * @param _recipient receiver of credit
   */
  function addCredit(address _recipient) external onlyOwner {
    credits[_recipient] = credits[_recipient].add(1);
  }

  /**
   * @dev Get token URI fro the given token, useful for testing purposes
   * @param _tokenId the token ID
   * @return the token ID or only the base URI if not found
   */
  function tokenURI(uint256 _tokenId) public view returns (string) {
    return Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId]);
  }

  /**
   * @dev Allows management to update the base tokenURI path
   * @dev Reverts if not called by owner
   * @param _newBaseURI the new base URI to set
   */
  function setTokenBaseURI(string _newBaseURI) external onlyOwner {
    tokenBaseURI = _newBaseURI;
  }

  function randomCardSetIndex(uint _index) public view returns (uint) {
    require(_index > 0);

    return uint(block.blockhash(block.number - _index)) % cardSetsInCirculation();
  }
}

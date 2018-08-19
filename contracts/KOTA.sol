pragma solidity ^0.4.24;

import "./Strings.sol";

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

/**
* @title KOTA aka KnownOrigin Trading Assets
*
* max 999 cards per box - if box interval is 1000000
* max 999 minted per card - if card set interval is 1000
*/
contract KOTA is ERC721Token, Ownable {
  using SafeMath for uint256;

  event CardMinted(address indexed _owner, uint256 indexed _tokenId, bytes32 _name, uint32 _mintTime);
  event CardSetSoldOut(uint256 indexed _cardNumber, uint32 _soldOutTime);
  event CardPackBought(address indexed _owner, uint32 _boughtTime);
  event CardPackRedeemed(address indexed _owner, uint32 _giftTime);

  string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public totalCardsInCirculation = 0;
  uint256 public totalCardsInCirculationSold = 0;
  uint256 public totalWei = 0;

  uint256 public defaultBoxNumber = 1000000;

  uint256 internal randNonce = 0;

  mapping(address => uint) public credits;

  struct Box {
    uint256 boxNumber;
    string title;
    string description;
    string boxURI;
    uint256 costOfPack;
    uint8 cardsPerPack;
  }

  struct CardSet {
    uint256 boxNumber;
    uint256 cardNumber;
    uint256 totalSupply;
    uint256 minted;
    bytes32 cardName;
    string cardURI;
    address artist;
    uint8 artistShare;
  }
  mapping(uint256 => Box) public boxNumberToBox;

  mapping(uint256 => CardSet) public boxCardNumberToCardSet;

  mapping(uint256 => CardSet[]) internal boxNumberToCardSetCirculation;
  mapping(uint256 => uint256[]) internal boxNumberToCardNumbers;

  mapping(uint256 => uint256) public boxNumberToCardsInCirculation;
  mapping(uint256 => uint256) public boxNumberToCardsInCirculationSold;

  uint256[] internal boxNumbers;

  constructor() public ERC721Token("KOTA", "KOTA") {}

  // can buy direct from contract if you send enough ether
  function() public payable {
    buyPack(defaultBoxNumber);
  }

  function addBox(uint256 _boxNumber, string _title, string _description, string _boxUri,  uint256 _costOfPack, uint8 _cardsPerPack) public onlyOwner {
    Box memory _newBox = Box(_boxNumber, _title, _description, _boxUri, _costOfPack, _cardsPerPack);

    boxNumberToBox[_boxNumber] = _newBox;
    boxNumbers.push(_boxNumber);
  }

  function addCardSet(
    uint256 _boxNumber,
    uint256 _cardNumber,
    uint256 _totalSupply,
    bytes32 _cardName,
    string _cardUri,
    address _artist,
    uint8 _artistShare
  ) public onlyOwner {
    require(boxNumberToBox[_boxNumber].boxNumber > 0, "Box should exist");

    uint256 _boxCardNumber = _boxNumber.add(_cardNumber);
    require(boxCardNumberToCardSet[_boxCardNumber].cardNumber == 0, "Card Set should not exist");

    // add new card set by boxCardNumber
    CardSet memory _newCardSet = CardSet(_boxNumber, _cardNumber, _totalSupply, 0, _cardName, _cardUri, _artist, _artistShare);
    boxCardNumberToCardSet[_boxCardNumber] = _newCardSet;

    // add to box circulation
    boxNumberToCardSetCirculation[_boxNumber].push(_newCardSet);
    boxNumberToCardNumbers[_boxNumber].push(_cardNumber);

    boxNumberToCardsInCirculation[_boxNumber] = boxNumberToCardsInCirculation[_boxNumber].add(_totalSupply);
    totalCardsInCirculation = totalCardsInCirculation.add(_totalSupply);
  }

  /**
   * @dev mints a single card
   * @param _to who will get the card
   * @param _boxNumber box number of card to mint
   * @param _cardNumber card number of the card set to transfer
   */
  function mint(address _to, uint256 _boxNumber, uint256 _cardNumber) public onlyOwner {
    uint256 _boxCardNumber = _boxNumber.add(_cardNumber);
    require(boxCardNumberToCardSet[_boxCardNumber].boxNumber > 0); // ensure real card set

    CardSet storage cardSet = boxCardNumberToCardSet[_boxCardNumber];

    // don't transfer last card!
    // buyPack removes from circulation via index - we don't know index here...
    require(cardSet.minted.add(1) < cardSet.totalSupply);

    boxNumberToCardsInCirculationSold[_boxNumber] = boxNumberToCardsInCirculationSold[_boxNumber].add(1);
    totalCardsInCirculationSold = totalCardsInCirculationSold.add(1);

    _mint(_to, cardSet);
  }

  /**
   * @dev Buys a pack of cards
   */
  function buyPack(uint256 _boxNumber) public payable {
    require(cardSetsInCirculation(_boxNumber) > 0);
    require(msg.value >= boxNumberToBox[_boxNumber].costOfPack);

    _randomPack(_boxNumber);

    // reconcile payments
    owner.transfer(boxNumberToBox[_boxNumber].costOfPack);
    totalWei = totalWei.add(boxNumberToBox[_boxNumber].costOfPack);

    // give back the change - if any
    msg.sender.transfer(msg.value - boxNumberToBox[_boxNumber].costOfPack);
    emit CardPackBought(msg.sender, uint32(now));
  }

  /**
   * @dev Redeem a pack of cards (via a credit)
   */
  function redeemPack(uint256 _boxNumber) public {
    require(credits[msg.sender] > 0);

    // remove credit
    credits[msg.sender] = credits[msg.sender].sub(1);

    _randomPack(_boxNumber);

    emit CardPackRedeemed(msg.sender, uint32(now));
  }

  // FIXME think about this...
  function burn(uint256 _tokenId) public {
    super._burn(msg.sender, _tokenId);
  }

  /**
   * @dev Return owned tokens
   * @param _owner address to query
   */
  function tokensOf(address _owner) public view returns (uint256[] _tokenIds) {
    return ownedTokens[_owner];
  }

  /**
   * @dev All box numbers
   */
  function allBoxNumbers() public view returns (uint256[] _boxNumbers) {
    return boxNumbers;
  }

  /**
   * @dev number of card sets in circulation for a box
   * @param _boxNumber box number of card sets
   */
  function cardSetsInCirculation(uint256 _boxNumber) public view returns (uint256 _cardSetCirculationLength) {
    return boxNumberToCardSetCirculation[_boxNumber].length;
  }

  /**
   * @dev card numbers for a box
   * @param _boxNumber box number of card sets
   */
  function cardNumbersOf(uint256 _boxNumber) public view returns (uint256[] _cardNumbersArray) {
    return boxNumberToCardNumbers[_boxNumber];
  }

  /**
   * @dev checks for owned tokens
   * @param _owner address to query
   */
  function hasTokens(address _owner) public constant returns (bool) {
    return ownedTokens[_owner].length > 0;
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
    return Strings.strConcat(tokenBaseURI, super.tokenURI(_tokenId));
  }

  /**
   * @dev Allows management to update the base tokenURI path
   * @dev Reverts if not called by owner
   * @param _newBaseURI the new base URI to set
   */
  function setTokenBaseURI(string _newBaseURI) external onlyOwner {
    tokenBaseURI = _newBaseURI;
  }

  function _randomPack(uint256 _boxNumber) internal {
    // thanks CryptoStrikers!
    require(msg.sender == tx.origin);

    for (uint i = 0; i < boxNumberToBox[_boxNumber].cardsPerPack; i++) {
      uint _index = _randomCardSetIndex(_boxNumber, i + 1);
      CardSet storage pickedSet = boxNumberToCardSetCirculation[_boxNumber][_index];

      _mint(msg.sender, pickedSet);

      // remove from circulation if minted == totalSupply
      if (pickedSet.minted == pickedSet.totalSupply) {
        _removeCardSetAtIndex(_boxNumber, _index);
        emit CardSetSoldOut(pickedSet.cardNumber, uint32(now));
      }
    }

    boxNumberToCardsInCirculationSold[_boxNumber] = boxNumberToCardsInCirculationSold[_boxNumber].add(boxNumberToBox[_boxNumber].cardsPerPack);
    totalCardsInCirculationSold = totalCardsInCirculationSold.add(boxNumberToBox[_boxNumber].cardsPerPack);
  }

  function _randomCardSetIndex(uint256 _boxNumber, uint _index) internal returns (uint) {
    require(_index > 0);

    randNonce = randNonce.add(1);
    bytes memory packed = abi.encodePacked(blockhash(block.number - _index), msg.sender, randNonce);
    return uint256(keccak256(packed)) % cardSetsInCirculation(_boxNumber);
  }

  function _mint(address _to, CardSet storage _cardSet) internal {
    // ensure valid card set
    require(_cardSet.totalSupply > 0);
    require(_cardSet.minted <= _cardSet.totalSupply);

    _cardSet.minted = _cardSet.minted.add(1);
    uint256 cardSerialNumber = _cardSet.boxNumber.add(_cardSet.cardNumber).add(_cardSet.minted);

    super._mint(_to, cardSerialNumber);
    super._setTokenURI(cardSerialNumber, _cardSet.cardURI);

    emit CardMinted(_to, cardSerialNumber, _cardSet.cardName, uint32(now));
  }

  function _removeCardSetAtIndex(uint256 _boxNumber, uint256 _index) internal {
    uint lastIndex = cardSetsInCirculation(_boxNumber) - 1;
    require(_index <= lastIndex);

    boxNumberToCardSetCirculation[_boxNumber][_index] = boxNumberToCardSetCirculation[_boxNumber][lastIndex];
    boxNumberToCardSetCirculation[_boxNumber].length--;
  }
}

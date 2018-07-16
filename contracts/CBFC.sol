pragma solidity ^0.4.21;


import "./ERC721Token.sol";

import "./Strings.sol";

import "./ERC165.sol";

import "./Whitelist.sol";

/**
* @title CBFC aka Crypto-Bands-FC
*/
contract CBFC is ERC721Token, ERC165, Whitelist {
  using SafeMath for uint256;

  bytes4 constant InterfaceSignature_ERC165 = 0x01ffc9a7;
  /*
  bytes4(keccak256('supportsInterface(bytes4)'));
  */

  bytes4 constant InterfaceSignature_ERC721Enumerable = 0x780e9d63;
  /*
  bytes4(keccak256('totalSupply()')) ^
  bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
  bytes4(keccak256('tokenByIndex(uint256)'));
  */

  bytes4 constant InterfaceSignature_ERC721Metadata = 0x5b5e139f;
  /*
  bytes4(keccak256('name()')) ^
  bytes4(keccak256('symbol()')) ^
  bytes4(keccak256('tokenURI(uint256)'));
  */

  bytes4 constant InterfaceSignature_ERC721 = 0x80ac58cd;
  /*
  bytes4(keccak256('balanceOf(address)')) ^
  bytes4(keccak256('ownerOf(uint256)')) ^
  bytes4(keccak256('approve(address,uint256)')) ^
  bytes4(keccak256('getApproved(uint256)')) ^
  bytes4(keccak256('setApprovalForAll(address,bool)')) ^
  bytes4(keccak256('isApprovedForAll(address,address)')) ^
  bytes4(keccak256('transferFrom(address,address,uint256)')) ^
  bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
  bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'));
  */

  bytes4 public constant InterfaceSignature_ERC721Optional = - 0x4f558e79;
  /*
  bytes4(keccak256('exists(uint256)'));
  */

  /**
   * @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
   * @dev Returns true for any standardized interfaces implemented by this contract.
   * @param _interfaceID bytes4 the interface to check for
   * @return true for any standardized interfaces implemented by this contract.
   */
  function supportsInterface(bytes4 _interfaceID) external pure returns (bool) {
    return ((_interfaceID == InterfaceSignature_ERC165)
    || (_interfaceID == InterfaceSignature_ERC721)
    || (_interfaceID == InterfaceSignature_ERC721Optional)
    || (_interfaceID == InterfaceSignature_ERC721Enumerable)
    || (_interfaceID == InterfaceSignature_ERC721Metadata));
  }

  event CardMinted(address indexed _owner, uint256 indexed _tokenId, bytes32 _name, uint32 mintTime);
  event CardSetSoldOut(uint256 indexed cardNumber, uint32 soldOutTime);

  string internal tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public costOfPack = 0.01 ether;
  uint8 constant public cardsPerPack = 4;

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
    super.addAddressToWhitelist(msg.sender);
  }

  // can buy direct from contract if you send enough ether
  function() public payable {
    buyPack();
  }

  function addCardSet(uint256 _cardNumber, uint256 _totalSupply, bytes32 _cardName, string _cardUri) public onlyOwner {
    CardSet memory newCardSet = CardSet(_cardNumber, _totalSupply, 0, _cardName, _cardUri);
    cardSets[_cardNumber] = newCardSet;
    cardSetCirculation.push(newCardSet);
  }

  /**
   * @dev Buys a pack of CBFC cards
   */
  function buyPack() public payable {
    require(msg.value >= costOfPack);
    require(cardSetCirculation.length >= cardsPerPack);

    // thanks CryptoStrikers!
    require(msg.sender == tx.origin);

    // return 4 different cards packs (that should have at least one card left)
    uint8[4] memory randomCardSetArray = [1, 2, 3, 4];

    for (uint i = 0; i < cardsPerPack; i++) {
      // err
      CardSet storage pickedSet = cardSets[randomCardSetArray[i]];

      // ensure valid card set
      require(pickedSet.totalSupply > 0);
      require(pickedSet.minted < pickedSet.totalSupply);

      pickedSet.minted = pickedSet.minted.add(1);
      uint256 serialNumber = pickedSet.cardNumber.add(pickedSet.minted);

      // remove from circulation if minted == totalSupply
      if (pickedSet.minted == pickedSet.totalSupply) {
        _removeCardSetAtIndex(randomCardSetArray[i]);
        CardSetSoldOut(pickedSet.cardNumber, uint32(now));
      }

      super._mint(msg.sender, serialNumber);
      CardMinted(msg.sender, serialNumber, pickedSet.cardName, uint32(now));
    }

    // reconcile payments
    owner.transfer(costOfPack);

    // give back the change - if any
    msg.sender.transfer(msg.value - costOfPack);
  }

  /**
   * @dev Buys a pack of CBFC cards
   * @param _cardNumber card number of the card set to transfer
   */
  function transferCard(uint256 _cardNumber) public onlyOwner {
    CardSet storage cardSet = cardSets[_cardNumber];

    // ensure valid card set
    require(cardSet.totalSupply > 0);
    require(cardSet.minted < cardSet.totalSupply);

    cardSet.minted = cardSet.minted.add(1);
    uint256 serialNumber = cardSet.cardNumber.add(cardSet.minted);

    super._mint(msg.sender, serialNumber);
    CardMinted(msg.sender, serialNumber, cardSet.cardName, uint32(now));
  }

  function _removeCardSetAtIndex(uint256 _index) internal {
    uint256 lastIndex = cardSetCirculation.length - 1;
    require(_index <= lastIndex);

    cardSetCirculation[_index] = cardSetCirculation[lastIndex];
    cardSetCirculation.length--;
  }

  //  /**
  //   * @dev Purchases multiple new InterfaceToken tokens
  //   * @dev Reverts if not called by curator
  //   * @param _nickname char stamp of token owner
  //   */
  //  function giftPack() public payable {
  //    require(msg.value >= costOfPack);
  //
  //    uint i = 0;
  //    for (i; i < cardsPerPack; i++) {
  //      super._mint(msg.sender, _tokenId);
  //      CardMinted(msg.sender, _tokenId, "name");
  //    }
  //
  //    // reconcile payments
  //    owner.transfer(costOfPack);
  //
  //    // give back the change - if any
  //    msg.sender.transfer(msg.value - costOfPack);
  //  }

  /**
   * @dev Return owned tokens
   * @param _owner address to query
   */
  function tokensOf(address _owner) public view returns (uint256[] _tokenIds) {
    return ownedTokens[_owner];
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
}

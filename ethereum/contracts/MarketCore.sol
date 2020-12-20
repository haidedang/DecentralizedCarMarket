pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./MarketBase.sol";
import "./ERC721Extended.sol";

contract MarketCore is Pausable, MarketBase {
  /// @dev The ERC-165 interface signature for ERC-721.
  ///  Ref: https://github.com/ethereum/EIPs/issues/165
  ///  Ref: https://github.com/ethereum/EIPs/issues/721
  bytes4 constant InterfaceSignature_ERC721 = bytes4(0x9a20483d);

  /// @dev Constructor creates a reference to the NFT ownership contract
  ///  and verifies the owner cut is in the valid range.
  /// @param _nftAddress - address of a deployed contract implementing
  ///  the Nonfungible Interface.
  /// @param _cut - percent cut the owner takes on each sale, must be
  ///  between 0-10,000.
  constructor(address _nftAddress, uint256 _cut) public {
    require(_cut <= 10000);
    ownerCut = _cut;

    ERC721Extended candidateContract = ERC721Extended(_nftAddress);
    require(candidateContract.supportsInterface(InterfaceSignature_ERC721));
    nonFungibleContract = candidateContract;
  }

  /// @dev Remove all Ether from the contract, which is the owner's cuts
  ///  as well as any Ether sent directly to the contract address.
  ///  Always transfers to the NFT contract, but can be called either by
  ///  the owner or the NFT contract.
  function withdrawBalance() external {
    address nftAddress = address(nonFungibleContract);

    require(
      msg.sender == owner ||
      msg.sender == nftAddress
    );
    // We are using this boolean method to make sure that even if one fails it will still work
    nftAddress.transfer(address(this).balance);
  }

  /// @dev Creates and begins a new sale.
  /// @param _tokenId - ID of token to sale, sender must be owner.
  /// @param _price - Price of item (in wei).
  /// @param _seller - Seller, if not the message sender
  function createSale(uint256 _tokenId, uint256 _price, address _seller) external whenNotPaused {
    require(_price == uint256(uint128(_price)));
    require(msg.sender == address(nonFungibleContract));

    _escrow(_seller, _tokenId);
    Sale memory sale = Sale(
      _seller,
      address(0),
      uint128(_price),
      uint64(now)
    );
    _addSale(_tokenId, sale);
  }

  /// @dev Participate in an open sale by bidding on the token
  ///  ownership of the NFT if enough Ether is supplied.
  /// @param _tokenId - ID of token to bid on.
  function bid(uint256 _tokenId)
  external
  payable
  whenNotPaused
  {
    Sale storage sale = tokenIdToSale[_tokenId];
    require(msg.sender != sale.seller);
    require(_isOnSale(sale));
    // requires that no one else has bid on this token before
    require(_hasBid(sale) == false);

    uint256 price = sale.price;
    // check if price is matched
    require(msg.value >= price);

    // save bidder address
    sale.bidder = msg.sender;
  }

  /// @dev Confirms a bid, can only be done by the seller
  /// @param _tokenId - ID of token to confirm the bid on.
  function confirmBid(uint256 _tokenId)
  external
  whenNotPaused {
    _confirmBid(_tokenId);
  }

  /// @dev Cancels a bid, can be done buy seller or bidder
  /// @param _tokenId - TokenId of sale to cancel.
  function cancelBid(uint256 _tokenId) external {
    Sale storage sale = tokenIdToSale[_tokenId];
    // check that this sale is currently live.
    require(_isOnSale(sale));
    // only seller and bidder can cancel this bid
    require(msg.sender == sale.bidder || msg.sender == sale.seller);
    _cancelBid(_tokenId);
  }

  /// @dev Cancels a sale that hasn't been finished yet.
  ///  Returns the NFT to original owner.
  /// @notice This is a state-modifying function that can
  ///  be called while the contract is paused.
  /// @param _tokenId - ID of token on sale
  function cancelSale(uint256 _tokenId) external
  {
    Sale storage sale = tokenIdToSale[_tokenId];
    require(_isOnSale(sale));
    address seller = sale.seller;
    require(msg.sender == seller);
    _cancelSale(_tokenId, seller);
  }

  /// @dev Cancels a sale when the contract is paused.
  ///  Only the owner may do this, and NFTs are returned to
  ///  the seller. This should only be used in emergencies.
  /// @param _tokenId - ID of the NFT on sale to cancel.
  function cancelSaleWhenPaused(uint256 _tokenId)
  whenPaused
  onlyOwner
  external
  {
    Sale storage sale = tokenIdToSale[_tokenId];
    require(_isOnSale(sale));
    _cancelSale(_tokenId, sale.seller);
  }

  /// @dev Returns sale info for an NFT on sale.
  /// @param _tokenId - ID of NFT on sale.
  function getSale(uint256 _tokenId) external view returns (address seller, address bidder, uint256 price, uint256 startedAt) {
    Sale storage sale = tokenIdToSale[_tokenId];
    require(_isOnSale(sale));
    return (
    sale.seller,
    sale.bidder,
    sale.price,
    sale.startedAt
    );
  }

  /// @dev Returns the price of a sale.
  /// @param _tokenId - ID of the token price we are checking.
  function getPrice(uint256 _tokenId)
  external
  view
  returns (uint256)
  {
    Sale storage sale = tokenIdToSale[_tokenId];
    require(_isOnSale(sale));
    return sale.price;
  }

}

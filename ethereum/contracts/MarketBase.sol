pragma solidity ^0.4.21;

import "./ERC721Extended.sol";

/// @title Sale Core
/// @dev Contains models, variables, and internal methods for the sale.
contract MarketBase {

  /// @dev The main Sale struct. Every sale in CryptoRide is represented by a copy of this struct
  struct Sale {
    // Current car owner
    address seller;
    // Person who has bid on this sale
    address bidder;
    // Car Price
    uint128 price;
    // Time when sale started
    uint64 startedAt;
  }

  // Reference to contract tracking NFT ownership
  ERC721Extended public nonFungibleContract;

  // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
  // Values 0-10,000 map to 0%-100%
  uint256 public ownerCut;

  // Map from token ID to their corresponding sale.
  mapping(uint256 => Sale) tokenIdToSale;

  event SaleCreated(uint256 tokenId, uint256 price);
  event SaleSuccessful(uint256 tokenId, uint256 price, address buyer);
  event SaleCancelled(uint256 tokenId);


  /// @dev Returns true if the claimant owns the token.
  /// @param _claimant - Address claiming to own the token.
  /// @param _tokenId - ID of token whose ownership to verify.
  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
  }

  /// @dev Escrows the NFT, assigning ownership to this contract.
  /// Throws if the escrow fails.
  /// @param _owner - Current owner address of token to escrow.
  /// @param _tokenId - ID of token whose approval to verify.
  function _escrow(address _owner, uint256 _tokenId) internal {
    // it will throw if transfer fails
    nonFungibleContract.transferFrom(_owner, this, _tokenId);
  }

  /// @dev Transfers an NFT owned by this contract to another address.
  /// Returns true if the transfer succeeds.
  /// @param _receiver - Address to transfer NFT to.
  /// @param _tokenId - ID of token to transfer.
  function _transfer(address _receiver, uint256 _tokenId) internal {
    // it will throw if transfer fails
    nonFungibleContract.transfer(_receiver, _tokenId);
  }

  /// @dev Adds a sale to the list of open sales.
  /// @param _tokenId The ID of the token to be put on sale.
  /// @param _sale Sale to add.
  function _addSale(uint256 _tokenId, Sale _sale) internal {
    tokenIdToSale[_tokenId] = _sale;

    emit SaleCreated(uint256(_tokenId), uint256(_sale.price));
  }

  /// @dev Cancels a sale.
  function _cancelSale(uint256 _tokenId, address _seller) internal {
    _removeSale(_tokenId);
    _transfer(_seller, _tokenId);
    emit SaleCancelled(_tokenId);
  }

  /// @dev Returns true if the NFT is on sale.
  /// @param _sale - Sale to check.
  function _isOnSale(Sale storage _sale) internal view returns (bool) {
    return (_sale.startedAt > 0);
  }

  /// @dev Returns true if the NFT has a bidder
  /// @param _sale - Sale to check.
  function _hasBid(Sale storage _sale) internal view returns (bool) {
    return (_sale.bidder != address(0));
  }

  /// @dev Computes the price and transfers winnings.
  /// Does NOT transfer ownership of token.
  /// @param _tokenId - Id of car token
  function _confirmBid(uint256 _tokenId)
  internal
  returns (uint256)
  {
    Sale storage sale = tokenIdToSale[_tokenId];

    // check that this sale is currently live.
    require(_isOnSale(sale));
    // can only confirm if there is a bidder
    require(_hasBid(sale));

    uint256 price = sale.price;

    address seller = sale.seller;

    address bidder = sale.bidder;

    // Remove the sale before sending the fees
    // to the sender so we can't have a reentrancy attack.
    _removeSale(_tokenId);

    // Transfer money to seller
    if (price > 0) {
      seller.transfer(price);
    }

    // transfer token to bidder
    _transfer(bidder, _tokenId);

    emit SaleSuccessful(_tokenId, price, msg.sender);
  }

  /// @dev Cancels a bid
  /// @param _tokenId - Id of car token
  function _cancelBid(uint256 _tokenId) internal {
    Sale storage sale = tokenIdToSale[_tokenId];
    address bidder = sale.bidder;
    sale.bidder = address(0);

    // transfer money back to bidder
    bidder.transfer(sale.price);
  }

  /// @dev Removes a sale from the list of open sales.
  /// @param _tokenId - ID of NFT on sale.
  function _removeSale(uint256 _tokenId) internal {
    delete tokenIdToSale[_tokenId];
  }
}

pragma solidity ^0.4.21;

import "./RideBase.sol";
import "./ERC721Extended.sol";

contract RideOwnership is RideBase, ERC721Extended {

  bytes4 constant InterfaceSignature_ERC165 =
  bytes4(keccak256('supportsInterface(bytes4)'));

  bytes4 constant InterfaceSignature_ERC721 =
  bytes4(keccak256('name()')) ^
  bytes4(keccak256('symbol()')) ^
  bytes4(keccak256('totalSupply()')) ^
  bytes4(keccak256('balanceOf(address)')) ^
  bytes4(keccak256('ownerOf(uint256)')) ^
  bytes4(keccak256('approve(address,uint256)')) ^
  bytes4(keccak256('transfer(address,uint256)')) ^
  bytes4(keccak256('transferFrom(address,address,uint256)')) ^
  bytes4(keccak256('tokensOfOwner(address)')) ^
  bytes4(keccak256('tokenMetadata(uint256,string)'));

  /// @notice Introspection interface as per ERC-165 (https://github.com/ethereum/EIPs/issues/165).
  ///  Returns true for any standardized interfaces implemented by this contract. We implement
  ///  ERC-165 (obviously!) and ERC-721.
  function supportsInterface(bytes4 _interfaceID) external view returns (bool)
  {
    return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
  }

  /// @dev Checks if a given address is the current owner of a particular Car.
  /// @param _claimant the address to validate.
  /// @param _tokenId car id, must be > 0
  function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return carIndexToOwner[_tokenId] == _claimant;
  }

  /// @dev Checks if a given address currently has transferApproval for a particular Car.
  /// @param _claimant the address to validate.
  /// @param _tokenId car id, must be > 0
  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
    return carIndexToApproved[_tokenId] == _claimant;
  }

  /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
  ///  approval. Setting _approved to address(0) clears all transfer approval.
  function _approve(uint256 _tokenId, address _approved) internal {
    carIndexToApproved[_tokenId] = _approved;
  }

  /// @notice Returns the number of Cars owned by a specific address.
  /// @param _owner The owner address to check.
  /// @dev Required for ERC-721 compliance
  function balanceOf(address _owner) public view returns (uint256 count) {
    return ownershipTokenCount[_owner];
  }

  /// @notice Transfers a Car to another address.
  /// @param _to The address of the recipient, can be an user or contract.
  /// @param _tokenId The ID of the Car to transfer.
  /// @dev Required for ERC-721 compliance.
  function transfer(
    address _to,
    uint256 _tokenId
  )
  external
  {
    // Safety check to prevent against an unexpected 0x0 default.
    require(_to != address(0));
    // Disallow transfers to this contract to prevent accidental misuse.
    // The contract should never own any cars
    require(_to != address(this));
    // Disallow transfers to the market contracts to prevent accidental
    // misuse. Market contracts should only take ownership of cars
    // through the allow + transferFrom flow.
    require(_to != address(market));

    // You can only send your own car.
    require(_owns(msg.sender, _tokenId));

    // Reassign ownership, clear pending approvals, emit Transfer event.
    _transfer(msg.sender, _to, _tokenId);
  }

  /// @notice Grant another address the right to transfer a specific Car via
  ///  transferFrom(). This is the preferred flow for transferring NFTs to contracts.
  /// @param _to The address to be granted transfer approval. Pass address(0) to
  ///  clear all approvals.
  /// @param _tokenId The ID of the Car that can be transferred if this call succeeds.
  /// @dev Required for ERC-721 compliance.
  function approve(
    address _to,
    uint256 _tokenId
  )
  public
  {
    // Only an owner can grant transfer approval.
    require(_owns(msg.sender, _tokenId));

    // Register the approval (replacing any previous approval).
    _approve(_tokenId, _to);

    // Emit approval event.
    emit Approval(msg.sender, _to, _tokenId);
  }

  /// @notice Transfer a Car owned by another address, for which the calling address
  ///  has previously been granted transfer approval by the owner.
  /// @param _from The address that owns the Car to be transferred.
  /// @param _to The address that should take ownership of the Car. Can be any address,
  ///  including the caller.
  /// @param _tokenId The ID of the Car to be transferred.
  /// @dev Required for ERC-721 compliance.
  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
  public
  {
    // Safety check to prevent against an unexpected 0x0 default.
    require(_to != address(0));
    // Disallow transfers to this contract to prevent accidental misuse.
    // The contract should never own any cars
    require(_to != address(this));
    // Check for approval and valid ownership
    require(_approvedFor(msg.sender, _tokenId));
    require(_owns(_from, _tokenId));

    // Reassign ownership (also clears pending approvals and emits Transfer event).
    _transfer(_from, _to, _tokenId);
  }

  /// @notice Returns the total number of Cars currently in existence.
  /// @dev Required for ERC-721 compliance.
  function totalSupply() public view returns (uint) {
    return cars.length;
  }

  /// @notice Returns the address currently assigned ownership of a given Car.
  /// @dev Required for ERC-721 compliance.
  function ownerOf(uint256 _tokenId)
  public
  view
  returns (address owner)
  {
    owner = carIndexToOwner[_tokenId];

    require(owner != address(0));
  }

  /// @notice Returns a list of all Car IDs assigned to an address.
  /// @param _owner The owner whose Cars we are interested in.
  /// @dev This should not be called by contract code since it's expensive
  function tokensOfOwner(address _owner) external view returns (uint256[] ownerTokens) {
    uint256 tokenCount = balanceOf(_owner);

    if (tokenCount == 0) {
      // Return an empty array
      return new uint256[](0);
    } else {
      uint256[] memory result = new uint256[](tokenCount);
      uint256 totalCars = totalSupply();
      uint256 resultIndex = 0;

      // We count on the fact that all cars have IDs starting at 1 and increasing
      // sequentially up to the totalCar count.
      uint256 carId;

      for (carId = 1; carId <= totalCars; carId++) {
        if (carIndexToOwner[carId] == _owner) {
          result[resultIndex] = carId;
          resultIndex++;
        }
      }

      return result;
    }
  }

}

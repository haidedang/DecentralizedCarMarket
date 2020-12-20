pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./MarketCore.sol";
import "./RideAccessControl.sol";

/// @title Base contract for CryptoRide. Holds all common structs, events and variables.
contract RideBase is RideAccessControl {

  /// @dev The Creation event is fired whenever a new car is mapped to the blockchain.
  event Creation(address owner, uint256 carId);

  /// @dev Transfer event which is emitted every time a car ownership is assigned, including creation
  event Transfer(address from, address to, uint256 carId);

  /// @dev The main Car struct. Every car in CryptoRide is represented by a copy of this struct
  struct Car {

    // The timestamp of car creation.
    uint64 creationTime;

    // The ID of the car manufacturer
    uint256 manufacturerId;

    // The address of the manufacturer
    address manufacturer;

    // The ID of the car model
    uint16 modelId;

    // The mileage of the car (in km)
    uint32 mileage;

    // Number of accidents involving this car
    uint8 accidentsCount;
  }

  /// @dev An array containing the Car struct for all Cars in existence. The ID
  ///  of each car is actually an index into this array.
  Car[] cars;

  // @dev A mapping from owner address to count of tokens that address owns.
  //  Used internally inside balanceOf() to resolve ownership count.
  mapping(address => uint256) ownershipTokenCount;

  /// @dev A mapping from Car IDs to the address of its owner.
  mapping(uint256 => address) public carIndexToOwner;

  /// @dev A mapping from Car IDs to an address that has been approved to call
  ///  transferFrom(). Each Car can only have one approved address for transfer
  ///  at any time. A zero value means no approval is outstanding.
  mapping(uint256 => address) public carIndexToApproved;

  /// @dev The address of the Market contract that handles sales of Cars.
  MarketCore public market;

  /// @dev Assigns ownership of a specific car to an address.
  function _transfer(address _from, address _to, uint256 _carId) internal {
    // update token count
    ownershipTokenCount[_to]++;
    // transfer ownership
    carIndexToOwner[_carId] = _to;
    // When creating new cars _from is 0x0, but we can't account that address.
    if (_from != address(0)) {
      ownershipTokenCount[_from]--;
      // remove transfer approval
      delete carIndexToApproved[_carId];
    }
    // Emit the transfer event.
    emit Transfer(_from, _to, _carId);
  }

  /// @dev An internal method that creates a new car and stores it. This
  ///  method doesn't do any checking and should only be called when the
  ///  input data is known to be valid. Will generate both a Creation event
  ///  and a Transfer event.
  /// @param _manufacturerId The manufacturer ID of the car.
  /// @param _modelId The model ID of the car.
  /// @param _mileage The current mileage of the car.
  /// @param _accidentsCount The car's accidents count
  /// @param _owner The initial owner of this car, must be non-zero
  function createCar(
    uint256 _manufacturerId,
    uint256 _modelId,
    uint256 _mileage,
    uint256 _accidentsCount,
    address _owner
  )
  public
  onlyManufacturer
  returns (uint)
  {
    require(_modelId == uint256(uint16(_modelId)));
    require(_mileage == uint256(uint32(_mileage)));
    require(_accidentsCount == uint256(uint16(_accidentsCount)));

    Car memory car = Car({
      creationTime : uint64(now),
      manufacturerId : _manufacturerId,
      manufacturer : msg.sender,
      modelId : uint16(_modelId),
      mileage : uint32(_mileage),
      accidentsCount : uint8(_accidentsCount)
      });
    uint256 newCarId = cars.push(car) - 1;

    // emit the creation event
    emit Creation(_owner, newCarId);

    // This will assign ownership, and also emit the Transfer event as
    // per ERC721 draft
    _transfer(0, _owner, newCarId);

    return newCarId;
  }

  /// @dev Update mileage of the car
  /// @param _id the ID of the car.
  /// @param _mileage The new mileage of the car.
  function updateMileage(uint256 _id, uint32 _mileage) external {
    Car storage car = cars[_id];
    require(msg.sender == car.manufacturer);
    require(_mileage >= car.mileage);
    car.mileage = _mileage;
  }

  /// @dev Update accidents count of the car
  /// @param _id the ID of the car.
  /// @param _accidentsCount The new accidents count of the car.
  function updateAccidentsCount(uint256 _id, uint8 _accidentsCount) external {
    Car storage car = cars[_id];
    require(msg.sender == car.manufacturer);
    require(_accidentsCount >= car.accidentsCount);
    car.accidentsCount = _accidentsCount;
  }
}

pragma solidity ^0.4.21;

import "./RideOwnership.sol";

contract RideCore is RideOwnership {

  /// @notice Creates the main CryptoRide smart contract.
  constructor() public {
    // make admin also manufacturer to create dummy assets
    addManufacturer(msg.sender);

    // create the mystic lambo
    createCar(0, 0, 0, 0, msg.sender);
  }

  function createDummyData() external onlyAdmin {
    createCar(1, 1, 25000, 0, msg.sender);
    createCar(2, 2, 40000, 0, msg.sender);
    createCar(3, 3, 1000000, 3, msg.sender);
    createCar(4, 4, 3300, 0, msg.sender);
    createCar(5, 5, 2421, 1, msg.sender);
    createCar(6, 6, 27000, 1, msg.sender);
    createCar(7, 7, 100303, 2, msg.sender);
    createCar(8, 8, 50000, 1, msg.sender);
    createCar(9, 9, 1100, 0, msg.sender);
    createCar(10, 10, 2000, 0, msg.sender);

    _approve(0, market);
    _approve(1, market);
    _approve(2, market);
    _approve(3, market);
    _approve(4, market);
    _approve(5, market);
    _approve(6, market);
    _approve(7, market);
    _approve(8, market);

    uint256 _ether = 1000000000000000000;
    // wei

    market.createSale(0, 3 * _ether, msg.sender);
    market.createSale(1, 10 * _ether, msg.sender);
    market.createSale(2, 20 * _ether, msg.sender);
    market.createSale(3, 5 * _ether, msg.sender);
    market.createSale(4, 6 * _ether, msg.sender);
    market.createSale(5, 15 * _ether, msg.sender);
    market.createSale(6, 23 * _ether, msg.sender);
    market.createSale(7, 12 * _ether, msg.sender);
    market.createSale(8, 10 * _ether, msg.sender);
  }

  /// @notice Returns all the relevant information about a specific car.
  /// @param _id The ID of the car of interest.
  function getCar(uint256 _id)
  external
  view
  returns (
    uint256 manufacturerId,
    uint256 modelId,
    uint256 mileage,
    uint256 accidentsCount,
    uint256 creationTime,
    address manufacturer
  ) {
    Car storage car = cars[_id];

    manufacturerId = uint256(car.manufacturerId);
    modelId = uint256(car.modelId);
    mileage = uint256(car.mileage);
    accidentsCount = uint256(car.accidentsCount);
    creationTime = uint256(car.creationTime);
    manufacturer = car.manufacturer;
  }

  /// @dev Sets the reference to the sale auction.
  /// @param _address - Address of sale contract.
  function setMarket(address _address) external onlyAdmin {
    MarketCore candidateContract = MarketCore(_address);
    // Set the new contract address
    market = candidateContract;
  }

  // @dev Put a car up for sale.
  function createSale(uint256 _carId, uint256 _price) external {
    // check ownership
    require(_owns(msg.sender, _carId));
    // get transfer rights
    _approve(_carId, market);
    // create actual sale
    market.createSale(_carId, _price, msg.sender);
  }

  // @dev Allows the Admin to capture the balance available to the contract.
  function withdrawBalance() external onlyAdmin {
    msg.sender.transfer(address(this).balance);
  }
}

pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RideCore.sol";

// these test are failing because of access control
// we need this file however to run the tests in testRide.js, else they are ignored
contract TestRide {
  RideCore ride = RideCore(DeployedAddresses.RideCore());
  MarketCore market = MarketCore(DeployedAddresses.MarketCore());

  uint createdCarId = 0;
  function testCreateAndGet() {
    uint _manufacturerId = 1;
    uint _modelId = 232;
    uint _mileage = 25000;
    uint _accidentsCount = 2;

    uint returnedId = ride.createCar(
      _manufacturerId,
      _modelId,
      _mileage,
      _accidentsCount,
      tx.origin
    );

    createdCarId = returnedId;

    var (manufacturerId, modelId, mileage, accidentsCount, creationTime, manufacturer) = ride.getCar(returnedId);
    Assert.equal(_manufacturerId, manufacturerId, "Manufacturer ID mismatch");
    Assert.equal(_modelId, modelId, "Model ID mismatch");
    Assert.equal(_mileage, mileage, "Mileage mismatch");
    Assert.equal(_accidentsCount, accidentsCount, "Accidents count mismatch");

    var owner = ride.ownerOf(createdCarId);
    Assert.equal(tx.origin, owner, "Owner mismatch");
  }

  function testCreateSale() {
    uint256 _price = 250000;
    ride.createSale(createdCarId, _price);

    var (seller, bidder, price, startedAt) = market.getSale(createdCarId); // ==> This fails somehow, dk why. Works on commandline

    Assert.equal(this, seller, "Seller address mismatch");
    Assert.equal(_price, price, "Price mismatch");
  }
}

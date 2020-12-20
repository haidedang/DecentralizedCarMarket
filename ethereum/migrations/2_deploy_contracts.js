let RideCore = artifacts.require('./RideCore.sol')
let MarketCore = artifacts.require('./MarketCore.sol')

module.exports = function (deployer) {
  let ownerCut = 10000 // 10% (#cryptorich)

  let ride
  let market
  deployer.deploy(RideCore)
    .then(function (instance) {
      ride = instance
      console.log("RideCore deployed")
      return deployer.deploy(MarketCore, RideCore.address, ownerCut)
        .then(function (instance) {
          market = instance
          console.log("MarketCore deployed")
        })
        .then(function () {
          ride.setMarket(MarketCore.address)
        })
        .then(function () {
          ride.createDummyData()
        })
    })
}

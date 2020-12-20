const artifacts = require('../build/contracts/RideCore.json')
const contract = require('truffle-contract')
const RideCore = contract(artifacts)
RideCore.setProvider(web3.currentProvider)

module.exports = function (callback) {
  let bmw = 6
  let account = web3.eth.accounts[0]
  let ether = 1000000000000000000
  let rideCore
  let model = Math.floor(Math.random() * 10);
  web3.eth.defaultAccount = account
  RideCore.web3.eth.defaultAccount = web3.eth.defaultAccount
  RideCore.deployed()
    .then(instance => {
      rideCore = instance
      return rideCore.createCar(bmw, model, 0, 0, account, {from: account, gas: 3000000})
    })
    .then(result => {
      console.log("Car created")
      return sleep(5000)
    })
    .then(_ => {
      return rideCore.totalSupply.call()
    })
    .then(totalSupply => {
      let carId = totalSupply - 1
      console.log("Created Car ID:", carId)
      return rideCore.createSale(carId, ether * 5, {from: account, gas: 3000000})
    })
    .then(result => {
      console.log("Sale created")
    })
    .catch(error => {
      console.log("Failed to create car", error)
    })

}

// sleep time expects milliseconds
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

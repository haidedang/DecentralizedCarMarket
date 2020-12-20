const artifacts = require('../build/contracts/RideCore.json')
const contract = require('truffle-contract')
const RideCore = contract(artifacts)
RideCore.setProvider(web3.currentProvider)

module.exports = function (callback) {
  let account = web3.eth.accounts[0]
  let bmwAccount = web3.eth.accounts[1]
  let rideCore
  web3.eth.defaultAccount = account
  RideCore.web3.eth.defaultAccount = web3.eth.defaultAccount
  RideCore.deployed()
    .then(instance => {
      rideCore = instance
      return rideCore.addManufacturer(bmwAccount, {from: account, gas: 200000})
    })
    .then(result => {
      console.log("Add manufacturer successful")
    })
    .catch(error => {
      console.error("Failed to add manufacturer", error)
    })

}

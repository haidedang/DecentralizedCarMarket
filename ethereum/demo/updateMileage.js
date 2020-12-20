const artifacts = require('../build/contracts/RideCore.json')
const contract = require('truffle-contract')
const RideCore = contract(artifacts)
RideCore.setProvider(web3.currentProvider)

module.exports = function (callback) {
  web3.eth.defaultAccount = web3.eth.accounts[0]
  RideCore.web3.eth.defaultAccount = web3.eth.defaultAccount
  let carId = 10
  RideCore.deployed()
    .then(function (instance) {
      instance.getCar.call(carId)
        .then(car => {
          let mileage = car[2]
          let newMileage = parseInt(mileage) + Math.floor(Math.random() * 300);
          instance.updateMileage(carId, newMileage)
            .then(() => {
              instance.getCar.call(carId)
                .then(updatedCar => {
                  console.log("Updated mileage: " + updatedCar[2] + " km")
                })
            })
            .catch(error => {
              console.error(error)
            })
        })
        .catch(function (error) {
          console.error(error)
        })
    })
}

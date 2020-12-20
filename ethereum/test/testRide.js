const RideCore = artifacts.require('./RideCore.sol')
const MarketCore = artifacts.require('./MarketCore.sol')

contract('RideCore', async (accounts) => {

  // get contract instances and account
  let rideCore = await RideCore.deployed()
  let marketCore = await MarketCore.deployed()
  let account = accounts[0]
  let buyer = accounts[1]
  let oneEther = 1000000000000000000

  it("should create a new car", async () => {
    console.log("Account: " + account)
    let _manufacturerId = 1
    let _modelId = 232
    let _mileage = 25000
    let _accidentsCount = 2

    await rideCore.createCar(_manufacturerId, _modelId, _mileage, _accidentsCount, account, {from: account})

    let carId = await rideCore.totalSupply.call() - 1
    let res = await rideCore.getCar.call(carId)
    let jsonRes = JSON.parse(JSON.stringify(res))

    console.log("Car created: " + jsonRes)

    assert.equal(_manufacturerId, jsonRes[0])
    assert.equal(_modelId, jsonRes[1])
    assert.equal(_mileage, jsonRes[2])
    assert.equal(_accidentsCount, jsonRes[3])
  })

  it("should create a new sale / offer", async () => {
    await rideCore.createCar(11, 22, 1313, 1, account, {from: account})

    let carId = await rideCore.totalSupply.call() - 1
    await rideCore.createSale(carId, 242242)

    let sale = await marketCore.getSale.call(1)
    console.log("Sale found: " + sale)
  })

  it("should query all cars", async () => {
    let totalSupply = await rideCore.totalSupply.call()
    console.log("Total number of Cars: " + totalSupply)

    let carIds = []
    for (let id = 0; id < totalSupply; id++) {
      carIds.push(id)
    }

    let carPromises = carIds.map(id => rideCore.getCar.call(id))

    Promise.all(carPromises)
      .then(results => {
        assert.equal(results.length, totalSupply)
      })
  })

  it("should simulate the buy and confirm process", async () => {
    await rideCore.createCar(11, 22, 1313, 1, account, {from: account})

    let ether = 1000000000000000000
    let carId = await rideCore.totalSupply.call() - 1
    await rideCore.createSale(carId, ether)

    await marketCore.bid(carId, {from: buyer, value: ether})

    await marketCore.confirmBid(carId, {from: account})

    let newOwner = await rideCore.ownerOf.call(carId)
    assert.equal(buyer, newOwner)
  })

  it("should simulate creating offer and canceling it", async () => {
    await rideCore.createCar(11, 22, 1313, 1, account, {from: account})

    let carId = await rideCore.totalSupply.call() - 1
    await rideCore.createSale(carId, oneEther)

    await marketCore.bid(carId, {from: buyer, value: oneEther})

    await marketCore.cancelBid(carId, {from: account})

    let res = await marketCore.getSale.call(carId)
    let sale = JSON.parse(JSON.stringify(res))

    assert.equal(0, sale[1])
  })

  it("should simulate updating car mileage", async () => {
    await rideCore.createCar(11, 22, 1313, 1, account, {from: account})

    let carId = await rideCore.totalSupply.call() - 1
    let newMileage = 100000
    await rideCore.updateMileage(carId, 100000)

    let res = await rideCore.getCar.call(carId)
    let car = JSON.parse(JSON.stringify(res))
    assert.equal(newMileage, car[2])

  })

  it("should simulate updating car accidents count", async () => {
    await rideCore.createCar(11, 22, 1313, 1, account, {from: account})

    let carId = await rideCore.totalSupply.call() - 1
    let newAccidentsCount = 3
    await rideCore.updateAccidentsCount(carId, 3)

    let res = await rideCore.getCar.call(carId)
    let car = JSON.parse(JSON.stringify(res))
    assert.equal(newAccidentsCount, car[3])

  })
})

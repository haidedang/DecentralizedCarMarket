import getWeb3 from './util/getWeb3'

import RideCore from '../ethereum/build/contracts/RideCore.json'
import MarketCore from '../ethereum/build/contracts/MarketCore.json'

const contract = require('truffle-contract')

let instance
let ethPrice = 500
const zeroAddress = '0x0000000000000000000000000000000000000000'

/**
 * This class represents the interface to the Ethereum net.
 */
class EthereumClient {

  /**
   * Constructs a new client instance.
   *
   * @param web3Instance injected web3 instance
   * @param rideCore Ethereum contract
   * @param marketCore Ethereum contract
   */
  constructor(web3Instance, rideCore, marketCore) {
    this.web3Instance = web3Instance
    this.rideCore = rideCore
    this.marketCore = marketCore
    let price = EthereumClient.fetchEtherPrice()
    if (price != null) {
      ethPrice = price
    }
  }

  static async getInstance() {
    if (instance == null) {
      instance = await EthereumClient.build()
    }
    return instance
  }

  static getEthPrice() {
    return parseInt(ethPrice)
  }

  static async build() {
    let web3 = await getWeb3
    let rideCoreContract = contract(RideCore)
    rideCoreContract.setProvider(web3.currentProvider)
    let rideCore = await rideCoreContract.deployed()

    let marketCoreContract = contract(MarketCore)
    marketCoreContract.setProvider(web3.currentProvider)
    let marketCore = await marketCoreContract.deployed()
    return new EthereumClient(web3, rideCore, marketCore)
  }

  static fetchEtherPrice() {
    let result = EthereumClient.Get('https://api.coinmarketcap.com/v1/ticker/ethereum/')
    if (result == null) {
      return null
    } else {
      let jsonObj = JSON.parse(result)
      return jsonObj[0].price_usd
    }
  }

  static Get(yourUrl) {
    const httpReq = new XMLHttpRequest()
    try {
      httpReq.open('GET', yourUrl, false)
      httpReq.send(null)
      return httpReq.responseText
    } catch (error) {
      console.log('Failed to execute get request')
      return null
    }
  }

  /**
   * Return the currently selected account on MetaMask
   * @returns {Promise<*>} Address of the account
   */
  async getUserAccount() {
    let accounts = await this.web3Instance.eth.getAccounts()
    return accounts[0]
  }

  /**
   * Retrieves all cars owned by the current user
   * @returns Promise<any> of cars owned by current user
   */
  getCarsOfCurrentUser() {
    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          return this.getCarsByAccount(account)
        })
        .then(results => {
          resolve(results)
        })
        .catch(error => {
          reject('Failed to retrieve cars of user', error)
        })
    })
  }

  /**
   * Retrieves all cars from Ethereum that are owned by the given account.
   * @param account: account in question
   *
   * @returns Promise<any> of cars owned by the given account
   */
  getCarsByAccount(account) {
    console.log('Fetch cars of account:', account)
    let ownedCarIds
    return new Promise((resolve, reject) => {
      this.rideCore.tokensOfOwner
        .call(account)
        .then(carIds => {
          ownedCarIds = carIds
          // console.log('Found carIds belonging to owner.', carIds)
          let carPromises = carIds.map(id => this.rideCore.getCar.call(id))
          return Promise.all(carPromises)
        })
        .then(cars => {
          // add ID to cars
          for (let i = 0; i < ownedCarIds.length; i++) {
            cars[i].unshift(ownedCarIds[i])
            // console.log('Car: ' + cars[i])
          }
          resolve(cars)
        })
        .catch(err => {
          console.error('Failed to retrieve cars of account: ' + account, err)
          reject('Failed to retrieve cars of account: ' + account)
        })
    })
  }

  /**
   * Retrieves all existing cars from Ethereum.
   *
   * @returns {Promise<any>}
   */
  getAllCars() {
    return new Promise((resolve, reject) => {
      this.rideCore.totalSupply
        .call()
        .then(totalSupply => {
          const carIds = []
          for (let id = 0; id < totalSupply; id++) {
            carIds.push(id)
          }
          const carPromises = carIds.map(id => this.rideCore.getCar.call(id))
          return Promise.all(carPromises)
        })
        .then(cars => {
          // add car ids like this for now
          // definitely needs to be cleaned up
          cars.forEach((car, index) => {
            car.push(index)
          })
          resolve(cars)
        })
        .catch(err => {
          console.error(`Failed fetching cars: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Retrieves all car sales
   * @returns {Promise<any>}
   */
  getAllSales() {
    let carsFromChain = []
    return new Promise((resolve, reject) => {
      this.getAllCars()
        .then(cars => {
          carsFromChain = cars
          const salesPromises = cars.map((car, index) => {
            // // console.log("Checking car " + index)
            return this.marketCore.getSale
              .call(index)
              .then(res => {
                return res
              })
              .catch(() => {
                console.log(`Car ${index} is not on sale.`)
                // return error
              })
          })
          return Promise.all(salesPromises)
        })
        .then(sales => {
          // push car info to sale if sale is defined
          sales.forEach((sale, index) => {
            carsFromChain[index].forEach(car => {
              if (sale) {
                sale.push(car)
              }
            })
          })
          // remove remaining undefined sales from failed requests
          const actualSales = sales.filter(sale => sale === 0 || sale)
          resolve(actualSales)
        })
        .catch(err => {
          console.error(`Failed fetching cars: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Retrieves all car sales by user
   * @returns {Promise<any>}
   */
  async getSalesOfUser() {
    let account = await this.getUserAccount()
    let sales = await this.getAllSales()
    const results = []
    sales.forEach(sale => {
      if (account.toLowerCase()
        .localeCompare(sale[0]) === 0) {
        results.push(sale)
      }
    })
    return results
  }

  /**
   * Retrieves all car sales which are not created by the user
   * @returns {Promise<Array>}
   */
  async getSalesNotOfUser() {
    let account = await this.getUserAccount()
    let sales = await this.getAllSales()
    let result = []
    sales.forEach(sale => {
      let owner = sale[0]
      let bidder = sale[1]
      // filter own sales and sales with bidder
      if (account.toLowerCase()
        .localeCompare(owner) !== 0 && bidder.localeCompare(zeroAddress) === 0) {
        result.push(sale)
      }
    })
    return result
  }

  /**
   * Create a bid on a car asset
   * @param carId: Id of car
   * @param price: Price of car
   * @returns {Promise<any>}
   */
  bidOnCar(carId, price) {
    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          return account
        })
        .then(account => {
          return this.marketCore.bid(carId, { from: account, value: price })
        })
        .then(result => {
          resolve('success')
        })
        .catch(err => {
          console.error(`Failed bid: ${err}`)
          reject(err)
        })
    })
  }

  /**
   * Confirms the bid on the given car asset
   * @param carId: Id of car asset
   * @returns {Promise<any>}
   */
  confirmBid(carId) {
    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          return this.marketCore.confirmBid(carId, { from: account, gas: 150000 })
            .then(result => {
              resolve('Confirm bid successful')
            })
            .catch(error => {
              console.log(error)
              reject('Confirm bid failed', error)
            })
        })
    })
  }

  /**
   * Cancels the bid on the given car asset
   * @param carId: Id of the car asset
   * @returns {Promise<any>}
   */
  cancelBid(carId) {
    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          this.marketCore.cancelBid(carId, { from: account, gas: 150000 })
            .then(result => {
              resolve('Cancel bid successful')
            })
            .catch(error => {
              reject('Cancel bid failed', error)
            })
        })
    })
  }

  /**
   * Create a car asset
   * @param manufacturerId
   * @param modelId
   * @param mileage
   * @param accidentsCount
   * @returns {Promise<void>}
   */
  createCar(manufacturerId, modelId, mileage, accidentsCount) {
    console.log('Creating car ' + manufacturerId + ' with model ' + modelId)

    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          return this.rideCore.createCar(manufacturerId, modelId, mileage, accidentsCount, account, { from: account })
        })
        .then(result => {
          console.log('Create car successful')
          resolve('Create car successful')
        })
        .catch(error => {
          console.error(error)
          reject('Create car failed', error)
        })
    })
  }

  /**
   * Creates a sale of selected Car
   * @param {*} carId
   * @param {*} price
   */
  createSale(carId, price) {
    console.log('Creating sale for car ' + carId + ' with price ' + price)
    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          return this.rideCore.createSale(carId, price, { from: account })
        })
        .then(result => {
          console.log('Create sale successful')
          resolve('Create sale successful')
        })
        .catch(error => {
          reject('Create sale failed')
        })
    })
  }

  isManufacturer() {
    return new Promise((resolve, reject) => {
      this.getUserAccount()
        .then(account => {
          return this.rideCore.isManufacturer.call(account)
        })
        .then(result => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default EthereumClient

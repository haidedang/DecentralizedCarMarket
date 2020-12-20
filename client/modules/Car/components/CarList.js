import React, {Component} from 'react'

import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import styles from './CarList.css'

import EthereumClient from '../../../EthereumClient'
import {mapCarObjects, mapCars, mapChainSales, mapSalesObjects} from '../../../util/chainAttributeMapper'
import dummyInventory from '../../../../server/util/dummyData/inventory.json'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009900',
    },
    secondary: {
      main: '#ff0002',
    },
  },
})

class CarList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userCars: [],
      userSalesWithoutBid: [],
      userSalesWithBid: [],
      allSales: [],
      userAccount: {},
    }
  }

  componentDidMount() {
    this.getCarsOfCurrentUser()
    this.getSalesOfUser()
    this.getUserAccount()
    this.getAllSales()
  }

  getCarsOfCurrentUser() {
    EthereumClient.getInstance().then(client => {
      client.getCarsOfCurrentUser().then(cars => {
        const mappedCars = mapCars(cars, dummyInventory)
        const userCars = mapCarObjects(mappedCars)
        this.setState({
          userCars,
        })
      })
    })
  }

  getSalesOfUser() {
    EthereumClient.getInstance().then(client => {
      client.getSalesOfUser().then(sales => {
        const mappedResults = mapChainSales(sales, dummyInventory)
        const userSales = mapSalesObjects(mappedResults)
        const userSalesWithoutBid = this.filterSalesWithoutBid(userSales)
        const userSalesWithBid = this.filterSalesWithBid(userSales)
        this.setState({
          userSalesWithoutBid,
          userSalesWithBid,
        })
      })
    })
  }

  getUserAccount() {
    EthereumClient.getInstance().then(client => {
      client
        .getUserAccount()
        .then(account => {
          this.setState({
            userAccount: account,
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  getAllSales() {
    EthereumClient.getInstance().then(client => {
      client.getAllSales().then(sales => {
        const mappedResults = mapChainSales(sales, dummyInventory)
        const allSales = mapSalesObjects(mappedResults)
        this.setState({
          allSales,
        })
      })
    })
  }

  filterSalesWithoutBid(sales) {
    return sales.filter(sale => !parseInt(sale.bidder, 16))
  }

  filterSalesWithBid(sales) {
    return sales.filter(sale => parseInt(sale.bidder, 16))
  }

  filterSalesFromOthers(sales, account) {
    const parsedAccount = parseInt(account, 16)
    return sales.filter(sale => {
      const parsedSaleOwner = parseInt(sale.owner, 16)
      return parsedAccount !== parsedSaleOwner
    })
  }

  filterSalesWithBidFromUser(sales, account) {
    const parsedAccount = parseInt(account, 16)
    return sales.filter(sale => {
      const parsedSaleBidder = parseInt(sale.bidder, 16)
      return parsedAccount === parsedSaleBidder
    })
  }

  handleConfirmation(carId) {
    this.confirmBid(carId)
  }

  confirmBid(carId) {
    EthereumClient.getInstance().then(client => {
      client
        .confirmBid(carId)
        .then(() => {
          this.getSalesOfUser()
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  handleCancellation(carId) {
    this.cancelBid(carId)
  }

  cancelBid(carId) {
    EthereumClient.getInstance().then(client => {
      client
        .cancelBid(carId)
        .then(() => {
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  render() {
    const userCars = this.state.userCars
    const userSalesWithoutBid = this.state.userSalesWithoutBid
    const userSalesWithBid = this.state.userSalesWithBid
    const userAccount = this.state.userAccount
    const allSales = this.state.allSales
    const salesFromOthers = this.filterSalesFromOthers(allSales, userAccount)
    const userBidsOnSales = this.filterSalesWithBidFromUser(salesFromOthers, userAccount)
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <div className={styles.root}>
            <Grid container spacing={24} className={styles.muiGridContainer}>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <div className={styles.innerContent}>
                  <h2>Registered cars</h2>
                  {userCars.map((car, index) => (
                    <ListItem key={index}>
                      <Typography variant="subheading" color="default">
                        {`${car.manufacturer} ${car.model} | ${car.mileage} km | ${car.accident} accidents`}
                      </Typography>
                    </ListItem>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <div className={styles.innerContent}>
                  <h2>Cars on sale</h2>
                  {userSalesWithoutBid.map((sale, index) => (
                    <ListItem key={index}>
                      <Typography variant="subheading" color="default">
                        {`${sale.manufacturer} ${sale.model} | ${sale.price / 1000000000000000000} ETH | ${sale.mileage} km `}
                      </Typography>
                    </ListItem>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <div className={styles.innerContent}>
                  <h2>Waiting for confirmation</h2>
                  {userSalesWithBid.map((sale, index) => (
                    <Grid container spacing={8} key={index} className={styles.innerGridContainer}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subheading" color="default">
                          {`${sale.manufacturer} ${sale.model} | ${sale.price / 1000000000000000000} ETH`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} className={styles.textAlign}>
                        <Button className={styles.button} variant="raised" color="primary" fullWidth
                                onClick={() => this.handleConfirmation(sale.carId)}>
                          Confirm
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button className={styles.button} variant="raised" color="secondary" fullWidth
                                onClick={() => this.handleCancellation(sale.carId)}>
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <div className={styles.innerContent}>
                  <h2>Active bids</h2>
                  {userBidsOnSales.map((sale, index) => (
                    <Grid container spacing={8} key={index} className={styles.innerGridContainer}>
                      <Grid item xs={12} sm={9}>
                        <Typography variant="subheading" color="default">
                          {`${sale.manufacturer} ${sale.model} | ${sale.price / 1000000000000000000} ETH`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} className={styles.textAlign}>
                        <Button className={styles.button} variant="raised" color="secondary" fullWidth
                                onClick={() => this.handleCancellation(sale.carId)}>
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default CarList

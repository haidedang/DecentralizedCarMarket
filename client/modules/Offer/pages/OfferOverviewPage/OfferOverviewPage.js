import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import DirectionsCar from '@material-ui/icons/DirectionsCar'
import Today from '@material-ui/icons/Today'
import LockOpen from '@material-ui/icons/LockOpen'
import NoteAdd from '@material-ui/icons/NoteAdd'
import Update from '@material-ui/icons/Update'
import Star from '@material-ui/icons/Star'
import StarHalf from '@material-ui/icons/StarHalf'
import StarBorder from '@material-ui/icons/StarBorder'
import Chip from '@material-ui/core/Chip'

import {getSearchResults} from '../../../Search/SearchReducer'

import result0 from '../../images/result0.jpg'
import result1 from '../../images/result1.jpg'
import result2 from '../../images/result2.jpg'
import result3 from '../../images/result3.jpg'
import result4 from '../../images/result4.jpg'
import result5 from '../../images/result5.jpg'
import result6 from '../../images/result6.jpg'
import result7 from '../../images/result7.jpg'
import result8 from '../../images/result8.jpg'
import details from './dummy/details.json'

import styles from './OfferOverviewPage.css'
import EthereumClient from "../../../../EthereumClient"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#736b5c',
    },
    secondary: {
      main: '#1274CE',
    },
  },
})

function TabContainer(props) {
  return (
    <Typography component="div" style={{padding: 8 * 3}}>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

class OfferOverviewPage extends Component {

  state = {
    value: 0,
  }
  handleChange = (event, value) => {
    this.setState({value})
  }

  handleContact(car) {
    let email = 'owner.of.car@cryptoride.com'
    let subject = car.manufacturer + " " + car.model
    let emailBody = 'Hello,\n' + '\n' + 'I am interested in your car. Please contact me.\n' + '\n' + 'Best regards'

    emailBody = encodeURIComponent(emailBody)
    document.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody
  }

  handleBid(car) {
    const carId = car.carId
    const price = car.price
    EthereumClient.getInstance()
      .then(client => {
        client.bidOnCar(carId, price)
          .then(result => console.log(result))
      })
  }

  render() {
    const {value} = this.state
    const carId = this.props.params.id
    const car = this.props.searchResults.filter(searchResult => searchResult.carId.toString() === carId)[0]
    const price = car.price / 1000000000000000000
    const manufacturer = car.manufacturer
    const model = car.model
    const mileage = car.mileage
    const accidents = car.accidents
    const ethPrice = EthereumClient.getEthPrice()
    let handleContactClick = this.handleContact.bind(this, car)
    let handleBidClick = this.handleBid.bind(this, car)

    // for demo ... should be retrieved from db
    const images = [result0, result1, result2, result3, result4, result5, result6, result7, result8]
    const thumbnail = images[carId % images.length]
    return (
      <MuiThemeProvider theme={theme}>
        <div className={styles.container}>
          <Grid container spacing={0} className={styles.muiGridContainer}>
            <Grid item xs={10} className={styles.gridItem}>
              <Typography variant="headline">{`${manufacturer} ${model} - Limited Edition CHECK IT OUT!!`}</Typography>
            </Grid>
            <Grid item xs={2} className={styles.iconGridItem}>
              <a href="#">
                <StarBorder/>Remember
              </a>
            </Grid>
            <Grid item xs={8} className={styles.imageContainer}>
              <div style={{background: `#FFF url(http://localhost:8000/api/offer/${carId}/image) center`}}
                   className={styles.background}/>
            </Grid>
            <Grid item xs={4} className={styles.details}>
              <Grid container spacing={0} className={styles.upperDetails}>
                <Grid item xs={12} className={styles.gridItem}>
                  <LockOpen/>
                  {`${price} ETH`}
                  <div className={styles.subdescription}>{`${price * ethPrice} $`}</div>
                </Grid>
                <Grid item xs={12} className={styles.gridItem}>
                  <DirectionsCar/>
                  {`${mileage} km`}
                  <div className={styles.subdescription}>Used</div>
                </Grid>
                <Grid item xs={12} className={styles.gridItem}>
                  <Today/>
                  05/2012
                  <div className={styles.subdescription}>1 owner</div>
                </Grid>
                <Grid item xs={12} className={styles.gridItem}>
                  <Update/>
                  {'75kW'}
                  <div className={styles.subdescription}>102 HP</div>
                </Grid>
                <Grid item xs={12} className={styles.gridItem}>
                  <NoteAdd/>
                  {`${accidents}`}
                  <div className={styles.subdescription}>accidents</div>
                </Grid>
              </Grid>
              <Grid container spacing={0} className={styles.lowerDetails}>
                <Grid item xs={12} className={styles.lowerGridItem}>
                  <Grid container spacing={24}>
                    <Grid item xs={12} className={styles.gridItem}>
                      <Chip className={styles.chip} label="Car"/>
                      <Chip className={styles.chip} label="4 Wheels"/>
                      <Chip className={styles.chip} label="Steering Wheel"/>
                      <Chip className={styles.chip} label="Motor"/>
                      <Chip className={styles.chip} label="Works"/>
                      <Chip className={styles.chip} label="Most of the Time"/>
                    </Grid>
                    <Grid item xs={12} className={styles.gridItem}>
                      <div className={styles.seller}>Flintstone Car's</div>
                      <Star className={styles.gradeIcon}/>
                      <Star className={styles.gradeIcon}/>
                      <Star className={styles.gradeIcon}/>
                      <StarHalf className={styles.gradeIcon}/>
                      <StarBorder className={styles.gradeIcon}/>
                      <div className={styles.reviews}>(23)</div>
                    </Grid>
                    <Grid item xs={6} className={styles.gridItem}>
                      <Button className={styles.button} variant="outlined" size="large" color="primary" fullWidth
                              onClick={handleContactClick}>
                        Contact
                      </Button>
                    </Grid>
                    <Grid item xs={6} className={styles.gridItem}>
                      <Button className={styles.button} variant="raised" size="large" color="primary" fullWidth
                              onClick={handleBidClick}>
                        Bid Now
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={0} className={styles.muiGridContainer}>
            <Grid item xs={12} className={styles.tabs}>
              <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary" textColor="primary"
                    fullWidth>
                <Tab label="Car Details" className={styles.color}/>
                <Tab label="Equipment" className={styles.color}/>
                <Tab label="Description" className={styles.color}/>
                <Tab label="History" className={styles.color}/>
                <Tab label="Contact" className={styles.color}/>
              </Tabs>
              {value === 0 && <TabContainer>{details.details}</TabContainer>}
              {value === 1 && <TabContainer>{details.equipment}</TabContainer>}
              {value === 2 && <TabContainer>{details.description}</TabContainer>}
              {value === 3 && <TabContainer>{details.history}</TabContainer>}
              {value === 4 && <TabContainer>{details.contact}</TabContainer>}
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    searchResults: getSearchResults(state),
  }
}

OfferOverviewPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

OfferOverviewPage.propTypes = {
  params: PropTypes.object.isRequired,
  searchResults: PropTypes.array.isRequired,
}

export default connect(mapStateToProps)(OfferOverviewPage)

import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import EthereumClient from '../../../../EthereumClient'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'

import styles from './VertOfferCard.css'

import result0 from '../../images/result0.jpg'
import result1 from '../../images/result1.jpg'
import result2 from '../../images/result2.jpg'
import result3 from '../../images/result3.jpg'
import result4 from '../../images/result4.jpg'
import result5 from '../../images/result5.jpg'
import result6 from '../../images/result6.jpg'
import result7 from '../../images/result7.jpg'
import result8 from '../../images/result8.jpg'
import result9 from '../../images/result9.jpg'
import result10 from '../../images/result10.jpg'

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

class VertOfferCard extends Component {
  constructor(props) {
    super(props)
    this.handleBid = this.handleBid.bind(this)
    this.handleContact = this.handleContact.bind(this)
  }

  handleContact() {
    let email = 'owner.of.car@cryptoride.com'
    let subject = `${this.props.searchResult.manufacturer} ${this.props.searchResult.model}`
    let emailBody = 'Hello,\n' + '\n' + 'I am interested in your car. Please contact me.\n' + '\n' + 'Best regards'

    emailBody = encodeURIComponent(emailBody)
    document.location = 'mailto:' + email + '?subject=' + subject + '&body=' + emailBody
  }

  handleBid() {
    const carId = this.props.searchResult.carId
    const price = this.props.searchResult.price
    EthereumClient.getInstance()
      .then(client => {
        client.bidOnCar(carId, price)
          .then(result => console.log(result))
      })
  }

  render() {
    const owner = this.props.searchResult.owner
    const price = this.props.searchResult.price / 1000000000000000000
    const manufacturer = this.props.searchResult.manufacturer
    const model = this.props.searchResult.model
    const mileage = this.props.searchResult.mileage
    const accidents = this.props.searchResult.accidents
    const creationTime = this.props.searchResult.creationTime
    const ethPrice = EthereumClient.getEthPrice()
    const date = new Date(creationTime * 1000)
    let firstRegistration
    if (date.getMonth() > 9) {
      firstRegistration = `${date.getMonth()}/${date.getFullYear()}`
    } else {
      firstRegistration = `0${date.getMonth()}/${date.getFullYear()}`
    }
    const carId = this.props.searchResult.carId

    // for demo ... should be retrieved from db
    const images = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10]
    const thumbnail = images[carId % images.length]
    return (
      <MuiThemeProvider theme={theme}>
        <div className={styles.offer}>
          <Card className={styles.card}>
            <Link to={`/offer/${carId}`} className={styles.link}>
              <CardMedia className={styles.cover} image={`http://localhost:8000/api/offer/${carId}/image`} title="Car"/>
            </Link>
            <div>
              <CardContent>
                <Link to={`/offer/${carId}`} className={styles.link}>
                  <Typography variant="headline">{`${manufacturer} ${model}`}</Typography>
                </Link>
                <Grid className={styles.attrContainer} container spacing={16}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subheading" color="default">{`Owned by: ${owner}`}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subheading" color="default">
                      {`Price: ${price * ethPrice} $`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subheading" color="default">
                      {`First Registration: ${firstRegistration}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subheading" color="default">
                      {`Manufacturer: ${manufacturer}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subheading" color="default">
                      {`Model: ${model}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subheading" color="default">
                      {`Mileage: ${mileage} km`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subheading" color="default">
                      {`Accidents: ${accidents}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container spacing={16}>
                  <Grid item xs={12} sm={4}>
                    <Button className={styles.button} variant="outlined" size="large" color="primary" fullWidth
                            onClick={this.handleContact}>
                      Contact Owner
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button className={styles.button} variant="raised" size="large" color="primary" fullWidth
                            onClick={this.handleBid}>
                      Bid Now
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </div>
          </Card>
        </div>
      </MuiThemeProvider>
    )
  }
}

VertOfferCard.propTypes = {
  searchResult: PropTypes.object.isRequired,
}

export default VertOfferCard

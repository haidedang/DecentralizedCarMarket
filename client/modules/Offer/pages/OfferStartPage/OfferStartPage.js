import React, {Component} from "react"
import {withRouter} from "react-router"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import styles from "./OfferStartPage.css"
import $ from "jquery"

import EthereumClient from "../../../../EthereumClient"

const DetailInitialState = {
  label: "detail",
  title: "",
  description: "",
  price: "",
  counter: "0",
  files: [],
  fileImages: [],
  imageUploaded: ["block"],
  submit: false
}

const ContactInitialState = {
  label: "contact",
  firstName: "",
  email: "",
  submit: false
}

const CarInitialState = {
  label: "car",
  name: "",
  carId: "",
  modelId: "",
  mileage: "",
  accidentsCount: "",
  creationTime: "",
  owner: "",
  cars: [],
  selectedCar: ""
}

class OfferStartPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      car: CarInitialState,
      detail: DetailInitialState,
      contact: ContactInitialState,
      submit: true
    }
    this.click = this.click.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    if (this.props.location.state !== null) {
      this.setState(this.props.location.state)
    }
  }

  componentDidMount() {
    if (this.state.contact.submit == true && this.state.detail.submit == true) {
      this.setState({submit: false})
    }
  }

  click(label) {
    this.props.router.push({
      pathname: `/offer/${label}`,
      state: this.state
    })
  }

  renderButton(component) {
    if (component.submit) {
      return (
        <Button
          onClick={this.click.bind(this, component.label)}
          variant="outlined"
          color="primary"
        >
          Edit
        </Button>
      )
    } else {
      return (
        <Button
          onClick={this.click.bind(this, component.label)}
          variant="outlined"
          color="secondary"
        >
          Add
        </Button>
      )
    }
  }

  async submit() {
    console.log(this.state)
    const that = this
    let ethereumClient = await EthereumClient.getInstance()
    let ether = 1000000000000000000

    await ethereumClient.createSale(
      parseInt(this.state.car.carId),
      parseFloat(this.state.detail.price) * ether
    )
    let data = new FormData()
    data.append("offer", JSON.stringify(this.state))
    this.state.detail.files.forEach(file => {
      data.append("file", file)
    })
    /* this.setState({OfferImages:data}, () => { 
      console.log(this.state)
    }) */
    $.post({
      method: "POST",
      data: data,
      url: "http://localhost:8000/api/offer",
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data)
        that.props.router.push({
          pathname: `/`
        })
      }
    })

    /* ethereumClient.createSale(9, 242242); */
    //send all Form Data to Server
  }

  render() {
    console.log("Start rendering OfferStart component ...")
    return (
      <div className={styles.root}>
        <div className={styles.distance}/>
        <div className={styles.container}>
          <div className={styles.innerBox}>
            <Grid className={styles.box} container>
              <h1>Create your Offer</h1>
              <Grid container className={styles.detail}>
                <Grid item xs={12} sm={10}>
                  <h3>1. Car</h3>
                  <p>Choose your Car</p>
                </Grid>
                <Grid item xs={12} sm={2}>
                  {this.renderButton(this.state.car)}
                </Grid>
              </Grid>

              <Grid container className={styles.detail}>
                <Grid item xs={12} sm={10}>
                  <h3>2. Details</h3>
                  <p>Pics, Description, Price</p>
                </Grid>
                <Grid item xs={12} sm={2}>
                  {this.renderButton(this.state.detail)}
                </Grid>
              </Grid>

              <Grid className={styles.detail} container>
                <Grid item xs={12} sm={10}>
                  <h3>3. Contact</h3>
                  <p>Address, Phone number, Email </p>
                </Grid>
                <Grid item xs={12} sm={2}>
                  {this.renderButton(this.state.contact)}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div className={styles.seperate}/>
              <Grid className={styles.box}>
                <Button
                  disabled={this.state.submit}
                  onClick={this.submit}
                  variant="raised"
                  color="secondary"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(OfferStartPage)

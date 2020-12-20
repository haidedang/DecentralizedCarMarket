import React, {Component} from "react"
import {withRouter} from "react-router"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import styles from "./OfferCarPage.css"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import FormControl from "@material-ui/core/FormControl"

import EthereumClient from "../../../../EthereumClient"
import {RadioGroup} from "@material-ui/core"
import dummyInventory from "../../../../../server/util/dummyData/inventory.json"
import {mapCars} from "../../../../util/chainAttributeMapper"

class OfferCarPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      car: {
        carId: "",
        modelId: "",
        mileage: "",
        accidentsCount: "",
        creationTime: "",
        owner: "",
        cars: []
      }
    }
    this.renderCars = this.renderCars.bind(this)
    this.click = this.click.bind(this)
    this.showValue = this.showValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  click() {
    console.log(this.state)
    this.setState(
      {
        car: {...this.state.car, submit: true}
      },
      function () {
        this.props.router.push({
          pathname: "/offer/start",
          state: this.state
        })
      }
    )
  }

  componentWillMount() {
    this.setState(this.props.location.state)
    EthereumClient.getInstance().then(client => {
      client
        .getCarsOfCurrentUser()
        .then(cars => {
          const mappedCars = mapCars(cars, dummyInventory)
          this.setState({
            car: {...this.state.car, cars: mappedCars}
          })
        })
        .catch(error => {
          console.log("Error finding cars of user. " + error)
        })
    })
  }

  showValue(event) {
    let result = JSON.parse(event)
    console.log(result[0])
  }

  handleChange(event) {
    console.log("Handle change")
    let Cars = JSON.parse(event.target.name)
    let result = Cars.map(car => car[0])
    let selectedCar
    result.forEach(car => {
      if (car == event.target.value) {
        selectedCar = Cars[result.indexOf(car)]
      }
    })
    console.log(selectedCar)
    this.setState({
      car: {
        ...this.state.car,
        carId: event.target.value,
        name: selectedCar[1] + " " + selectedCar[2],
        mileage: selectedCar[3],
        accidentsCount: selectedCar[4]
      },
      owner: selectedCar[6]
    })
  }

  renderCars() {
    console.log("Render cars ...", this.state.car.cars)
    return this.state.car.cars.map(car => {
      let labelStr = `ID: ${car[0]}, ${car[1]} ${car[2]} - ${
        car[3]
        } km, Accidents: ${car[4]}`
      return (
        <FormControlLabel
          key={this.state.car.cars.indexOf(car)}
          value={car[0].toString()}
          name={JSON.stringify(car)}
          control={<Radio color="primary"/>}
          label={labelStr}
        />
      )
    })
  }

  render() {
    console.log("Start rendering OfferCarPage component ...")
    return (
      <div className={styles.root}>
        <div className={styles.distance}/>
        <div className={styles.container}>
          <div className={styles.innerBox}>
            <h1>Choose your Car</h1>
            <Grid className={styles.box} container>
              <FormControl component="fieldset" required>
                <RadioGroup
                  value={this.state.car.carId}
                  name={JSON.stringify(this.state.car.cars)}
                  onChange={this.handleChange}
                >
                  {this.renderCars()}
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <div className={styles.seperate}/>
              <Grid className={styles.box}>
                <Button onClick={this.click} variant="raised" color="secondary">
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

export default withRouter(OfferCarPage)

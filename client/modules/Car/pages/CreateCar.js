import React, {Component} from "react"
import {withRouter} from "react-router"
import Grid from "@material-ui/core/Grid"
import styles from "./CreateCar.css"
import Select from 'react-select'
import Button from "@material-ui/core/Button"
import 'react-select/dist/react-select.css'
import EthereumClient from '../../../EthereumClient'
import dummyInventory from '../../../../server/util/dummyData/inventory.json'

class CreateCar extends Component {

  state = {
    selectedModel: '',
    errorMessage: '',
    successMessage: ''
  }
  handleChange = (newValue) => {
    this.setState({selectedModel: newValue})
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    const {selectedModel} = this.state
    let bmwManufacturerId = 6

    EthereumClient.getInstance().then(client => {
      client.createCar(bmwManufacturerId, selectedModel.value, 0, 0)
        .then(result => {
          this.setState({successMessage: "Create car successful"})
        })
        .catch(error => {
          console.error("Failed to create car", error)
          this.setState({errorMessage: "Failed to create car. Permission denied!"})
        })
    })
  }

  getModels() {
    let bmwModels = dummyInventory.brands[6].models
    let models = []
    for (let i = 0; i < bmwModels.length; i++) {
      let modelName = bmwModels[i]
      models.push({value: i, label: modelName})
    }
    return models
  }

  componentWillMount() {
  }

  render() {
    const {selectedModel, errorMessage, successMessage} = this.state
    return (
      <div className={styles.root}>
        <div className={styles.distance}/>
        <div className={styles.container}>
          <div className={styles.innerBox}>
            <Grid className={styles.box} container>
              <h1>Create a new car</h1>
              <Grid container className={styles.detail} spacing={24}>
                <Grid item xs={12} sm={6}>
                  <h3>Brand</h3>
                </Grid>
                <Grid item xs={12} sm={6}>
                  BMW
                </Grid>

                <Grid item xs={12} sm={6}>
                  <h3>Model</h3>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Select
                    name="form-field-name"
                    value={selectedModel}
                    onChange={this.handleChange}
                    options={this.getModels()}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div className={styles.separator}/>
              <Grid className={styles.box}>
                <Button onClick={this.handleSubmit} variant="raised" color="secondary"
                        disabled={selectedModel == null || selectedModel === ''}>
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} className={styles.errorMessage}>
              {errorMessage}
            </Grid>
            <Grid item xs={12} sm={12} className={styles.successMessage}>
              {successMessage}
            </Grid>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CreateCar)

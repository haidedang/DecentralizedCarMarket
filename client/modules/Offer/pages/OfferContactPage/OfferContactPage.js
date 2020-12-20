import React, {Component} from "react"
import {withRouter} from "react-router"
import TextField from "@material-ui/core/TextField"
import {FormControlLabel} from "@material-ui/core/FormControlLabel"
import Button from "@material-ui/core/Button"
import Select from "react-select"
import Grid from "@material-ui/core/Grid"
import "react-select/dist/react-select.css"

import styles from "./OfferContactPage.css"

const initialState = {
  firstName: "",
  lastName: "",
  address: "",
  number: "",
  zipCode: "",
  place: "",
  salutation: "",
  email: ""
}

class OfferContactPage extends Component {
  constructor(props) {
    super(props)
    this.state = {contact: initialState}
    this.handleChange = this.handleChange.bind(this)
    this.click = this.click.bind(this)
    this.handleSalutationChange = this.handleSalutationChange.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
  }

  handleChange(event) {
    console.log(event.target.value)
    this.setState({
      contact: {...this.state.contact, [event.target.id]: event.target.value}
    })
  }

  handleSalutationChange(salutation) {
    this.setState({
      contact: {...this.state.contact, salutation: salutation.value}
    })
  }

  handleCountryChange(country) {
    this.setState({
      contact: {...this.state.contact, country: country.value}
    })
  }

  click() {
    this.setState(
      {
        contact: {...this.state.contact, submit: true}
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
    this.setState(this.props.location.state, function () {
      console.log(this.state)
    })
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.distance}/>
        <div className={styles.container}>
          <div className={styles.innerBox}>
            <Grid className={styles.box} container>
              <Grid container>
                <Grid
                  style={{
                    "padding-top": "20px",
                    "padding-bottom": " 10px",
                    "border-bottom": "1px solid rgb(206, 206, 206)"
                  }}
                  item
                  xs={12}
                  sm={12}
                >
                  <h4>Personal information</h4>
                </Grid>
                <Grid style={{"padding-top": "20px"}} item xs={12} sm={3}>
                  <Select
                    placeholder="salutation"
                    value={this.state.contact.salutation}
                    onChange={this.handleSalutationChange}
                    options={[
                      {value: "Mr.", label: "Mr."},
                      {value: "Mrs.", label: "Mrs."}
                    ]}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  helperText="*required"
                  id="firstName"
                  label="firstName"
                  defaultValue={this.state.contact.firstName}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid className={styles.input} item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  helperText="*required"
                  id="lastName"
                  label="lastName"
                  defaultValue={this.state.contact.lastName}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <TextField
                  fullWidth
                  required
                  helperText="*required"
                  id="address"
                  label="address"
                  defaultValue={this.state.contact.address}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid className={styles.input} item xs={12} sm={2}>
                <TextField
                  fullWidth
                  required
                  helperText="*required"
                  id="number"
                  label="number"
                  defaultValue={this.state.contact.number}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  helperText="*required"
                  id="zipCode"
                  label="Zip Code"
                  defaultValue={this.state.contact.zipCode}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid className={styles.input} item xs={12} sm={8}>
                <TextField
                  fullWidth
                  required
                  helperText="*required"
                  id="place"
                  label="place"
                  defaultValue={this.state.contact.place}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  helperText="*required"
                  label="email"
                  defaultValue={this.state.contact.email}
                  margin="normal"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid style={{"padding-top": "30px"}} item xs={12} sm={12}>
                <Select
                  placeholder="country"
                  value={this.state.contact.country}
                  onChange={this.handleCountryChange}
                  options={[
                    {value: "Deutschland", label: "Deutschland"},
                    {value: "Vietnam", label: "Vietnam"}
                  ]}
                />
              </Grid>

              <Grid className={styles.footer} item xs={12} sm={12}/>
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

export default withRouter(OfferContactPage)

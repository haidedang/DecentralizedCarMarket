import React, {Component, PropTypes} from 'react'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Select from 'react-select'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import 'react-select/dist/react-select.css'

import styles from './Searchbox.css'

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

const buttonStyle = {
  boxShadow: 'none',
}

const initialState = {
  brand: '',
  models: [],
  value: '',
  model: '',
  firstRegistration: '',
  country: '',
  disabled: true,
}

class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.handleBrandChange = this.handleBrandChange.bind(this)
    this.handleModelChange = this.handleModelChange.bind(this)
    this.handleFirstRegistrationChange = this.handleFirstRegistrationChange.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleBrandChange(brand) {
    if (brand) {
      this.setState({
        brand: brand.value,
        models: brand.models,
        model: initialState.model,
        disabled: false,
      })
    } else {
      this.setState({
        brand: initialState.brand,
        models: initialState.models,
        model: initialState.model,
        disabled: true,
      })
    }
  }

  handleModelChange(model) {
    if (model) {
      this.setState({
        model: model.value,
      })
    } else {
      this.setState({
        model: initialState.model,
      })
    }
  }

  handleSearch() {
    const brand = this.state.brand
    const model = this.state.model
    const firstRegistration = this.state.firstRegistration
    const country = this.state.country
    this.props.handleSearch(brand, model, firstRegistration, country)
  }

  handleFirstRegistrationChange(firstRegistration) {
    if (firstRegistration) {
      this.setState({
        firstRegistration: firstRegistration.value,
      })
    } else {
      this.setState({
        firstRegistration: initialState.firstRegistration,
      })
    }
  }

  handleCountryChange(country) {
    if (country) {
      this.setState({
        country: country.value,
      })
    } else {
      this.setState({
        country: initialState.country,
      })
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className={styles.root}>
          <Grid className={styles.header} container>
            <Grid item>
              <FormControlLabel control={<Checkbox/>} label="New"/>
            </Grid>
            <Grid item>
              <FormControlLabel control={<Checkbox/>} label="Used"/>
            </Grid>
          </Grid>

          <Grid container spacing={16} justify="center">
            <Grid item xs={12} sm={6}>
              <Select
                placeholder="Brand"
                value={this.state.brand}
                onChange={this.handleBrandChange}
                options={this.props.searchOptions.brands.map(brand => {
                  return {
                    value: brand.name,
                    label: brand.name,
                    models: brand.models,
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                placeholder="Model"
                value={this.state.model}
                onChange={this.handleModelChange}
                disabled={this.state.disabled}
                options={this.state.models.map(model => {
                  return {
                    value: model,
                    label: model,
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                placeholder="First Registration"
                value={this.state.firstRegistration}
                onChange={this.handleFirstRegistrationChange}
                options={this.props.searchOptions.firstRegistrations.map(firstRegistration => {
                  return {
                    value: firstRegistration,
                    label: firstRegistration,
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                placeholder="Country"
                value={this.state.country}
                onChange={this.handleCountryChange}
                options={this.props.searchOptions.countries.map(country => {
                  return {
                    value: country,
                    label: country,
                  }
                })}
              />
            </Grid>

            <Grid className={styles.footer} container spacing={16}>
              <Grid item xs={12} sm={6}>
                <a className={styles.link} href="#">
                  More Options
                </a>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="raised" style={buttonStyle} color="primary" size="medium" fullWidth
                        onClick={this.handleSearch}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }
}

SearchBox.propTypes = {
  searchOptions: PropTypes.shape({
    brands: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        models: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
        name: React.PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    countries: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
    firstRegistrations: React.PropTypes.arrayOf(React.PropTypes.number.isRequired).isRequired,
  }).isRequired,
  handleSearch: React.PropTypes.func.isRequired,
}

SearchBox.contextTypes = {
  router: React.PropTypes.object,
}

export default SearchBox

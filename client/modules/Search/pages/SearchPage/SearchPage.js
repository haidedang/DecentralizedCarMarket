import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'

import styles from './SearchPage.css'
import promoData from './dummy/promo.json'
import bg from './images/background.jpg'

import SearchBox from '../../components/Searchbox/Searchbox'
import HorzOfferList from '../../../Offer/components/HorzOfferList/HorzOfferList'
import Citations from '../../components/Citations/Citations'

import {addSearchParameters, fetchSearchOptions, fetchSearchResults} from '../../SearchActions'
import {getSearchOptions, getSearchParameters} from '../../SearchReducer'

class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(fetchSearchOptions())
  }

  handleSearch(brand, model, firstRegistration, country) {
    const searchParameters = {
      brand,
      model,
      firstRegistration,
      country,
    }
    this.props.dispatch(addSearchParameters(searchParameters))

    // put search results into store for later use
    this.props.dispatch(fetchSearchResults(brand, model)).then(() => {
      // move to results when search results have been stored
      this.context.router.push({
        pathname: '/results',
      })
    })
  }

  render() {
    return (
      <div className={styles.content}>
        <div style={{background: `#FFF url(${bg}) center`}} className={styles.searchBoxContainer}>
          <Grid container spacing={16} className={styles.gridContainer}>
            <Grid item xs={12} sm={6}>
              <SearchBox searchOptions={this.props.searchOptions} handleSearch={this.handleSearch}/>
            </Grid>
          </Grid>
        </div>
        <div className={styles.promoContainer}>
          <h2>Check out our promoted sellers!</h2>
          <HorzOfferList contentList={promoData}/>
        </div>
        <div className={styles.citationContainer}>
          <Citations/>
        </div>
      </div>
    )
  }
}

SearchPage.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

// Actions required to provide data for this component
SearchPage.need = [
  () => {
    return fetchSearchOptions()
  },
]

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    searchOptions: getSearchOptions(state),
    searchParameters: getSearchParameters(state),
  }
}

SearchPage.propTypes = {
  searchOptions: PropTypes.object.isRequired,
  searchParameters: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

SearchPage.contextTypes = {
  router: React.PropTypes.object,
}

export default connect(mapStateToProps)(SearchPage)

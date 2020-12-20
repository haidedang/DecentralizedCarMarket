import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styles from './ResultPage.css'

import {getSearchResults, getShowResults} from '../../SearchReducer'

import VertOfferList from '../../../Offer/components/VertOfferList/VertOfferList'

function ResultPage(props) {
  return <div className={styles.resultContainer}>{props.showResults ?
    <VertOfferList searchResults={props.searchResults}/> : null}</div>
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    showResults: getShowResults(state),
    searchResults: getSearchResults(state),
  }
}

ResultPage.propTypes = {
  showResults: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

ResultPage.contextTypes = {
  router: React.PropTypes.object,
}

export default connect(mapStateToProps)(ResultPage)

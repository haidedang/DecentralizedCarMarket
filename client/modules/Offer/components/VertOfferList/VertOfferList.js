import React, {PropTypes} from 'react'

import styles from './VertOfferList.css'

import VertOfferCard from '../VertOfferCard/VertOfferCard'

function VertOfferList(props) {
  return (
    <div>
      <h2 className={styles.title}>{`We found ${props.searchResults.length} result(s) for you!`}</h2>
      <div>{props.searchResults.map((searchResult, index) => <VertOfferCard searchResult={searchResult}
                                                                            key={index}/>)}</div>
    </div>
  )
}

VertOfferList.propTypes = {
  searchResults: PropTypes.array.isRequired,
}

export default VertOfferList

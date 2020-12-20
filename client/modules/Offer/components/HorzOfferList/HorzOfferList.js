import React, {PropTypes} from 'react'
import Grid from '@material-ui/core/Grid'

import styles from './HorzOfferList.css'

import HorzOfferCard from '../HorzOfferCard/HorzOfferCard'

function HorzOfferList(props) {
  return (
    <div className={styles.container}>
      <Grid container className={styles.gridContainer} spacing={24}>
        {props.contentList.map((content, index) => (
          <Grid item xs={4} key={index}>
            <HorzOfferCard content={content}/>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

HorzOfferList.propTypes = {
  contentList: PropTypes.array.isRequired,
}

export default HorzOfferList

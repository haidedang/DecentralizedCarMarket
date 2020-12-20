import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import styles from './Citations.css'

function Citations() {
  return (
    <div>
      <h2 style={{textAlign: 'center', paddingTop: '30px', fontWeight: 'normal'}}>Check out our customer reviews!</h2>
      <Grid container style={{margin: '0', paddingTop: '20px'}} spacing={0}>
        <Grid item xs={12} sm={4} className={styles.text}>
          <Typography variant="subheading" color="default">
            <div>"Have I ever told you how my car got stolen?"</div>
            <div>Some Uncle</div>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.text}>
          <Typography variant="subheading" color="default">
            <div>"Absolutely no idea what CryptoRide is, sorry."</div>
            <div>Everyone</div>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} className={styles.text}>
          <Typography variant="subheading" color="default">
            <div>"First Bitconnect and now there is this."</div>
            <div>Law Enforcement</div>
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default Citations

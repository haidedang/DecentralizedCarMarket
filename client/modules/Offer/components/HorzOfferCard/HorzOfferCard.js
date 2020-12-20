import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

import result0 from '../../images/result12.jpg'
import result1 from '../../images/result11.jpg'
import result2 from '../../images/result10.jpg'

import styles from './HorzOfferCard.css'

function HorzOfferCard(props) {
  const description = props.content.description
  const title = props.content.title
  const carId = props.content.carId

  // for demo ... should be retrieved from db
  const images = [result0, result1, result2]
  const thumbnail = images[carId % images.length]
  return (
    <div>
      <Card className={styles.card}>
        <CardMedia className={styles.cover} image={thumbnail}/>
        <CardContent>
          <Typography gutterBottom variant="headline" align="center" component="h2">
            {`${title}`}
          </Typography>
          {description ? (
            <Typography align="center" component="h4">
              {`${description}`}
            </Typography>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

HorzOfferCard.propTypes = {
  content: PropTypes.object.isRequired,
}

export default HorzOfferCard

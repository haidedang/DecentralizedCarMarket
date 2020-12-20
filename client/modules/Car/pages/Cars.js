import React, {Component} from 'react'
import CarList from '../components/CarList'

class Cars extends Component {
  render() {
    console.log('Start rendering Car component ...')
    return <CarList/>
  }
}

export default Cars

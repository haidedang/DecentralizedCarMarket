import React, { Component } from 'react'
import { Link } from 'react-router'
import { login, logout } from '../../AppActions'
import { connect } from 'react-redux'
import styles from './NavBar.css'
import { getToken } from '../../AppReducer'
import Login from '../Login/login'
import Register from '../Register/Register'
import EthereumClient from '../../../../EthereumClient'

/**
 * @return {null}
 */
function CreateCarLink(props) {
  if (props.isManufacturer) {
    return (
      <Link to="/car/creation" className={styles.navLink}>
        Create car
      </Link>
    )
  } else {
    return null
  }
}

class NavBar extends Component {
  state = {
    open: false,
    isManufacturer: false,
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleSubmit() {
    console.log(sessionStorage.token)
  }

  logout() {
    this.props.dispatch(logout())
  }

  componentDidMount() {
    try {
      this.props.dispatch(login(sessionStorage.token))
    } catch (err) {
      this.props.dispatch(logout())
    }
  }

  componentWillMount() {
    EthereumClient.getInstance()
      .then(client => {
        client.isManufacturer()
          .then(result => {
            this.setState({ isManufacturer: result })
          })
      })
  }

  render() {
    const { isManufacturer } = this.state
    if (typeof(this.props.token) == 'string' && this.props.token.includes('ey')) {
      return (
        <div className={styles.container}>
          <Link to="/" className={styles.title}>
            Crypto Ride
          </Link>
          <Link to="/offer/start" className={styles.navLink}>
            Offer
          </Link>
          <Link to="/cars" className={styles.navLink}>
            My Cars
          </Link>
          <CreateCarLink isManufacturer={isManufacturer}/>
          <Link onClick={this.logout} to="/" className={styles.navLink}>
            Logout
          </Link>
        </div>
      )
    } else {
      return (
        <div className={styles.container}>
          <Link to="/" className={styles.title}>
            Crypto Ride
          </Link>
          <Login/>
          <Register/>
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    token: getToken(state),
  }
}

export default connect(mapStateToProps)(NavBar)

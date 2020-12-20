import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { login } from '../../AppActions'
import getWeb3 from '../../../../util/getWeb3'
import 'babel-polyfill'
import AuthentificationService from '../../AuthentificationService'
import styles from '../NavBar/NavBar.css'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null,
    }
    this.register = this.register.bind(this)
  }

  componentWillMount() {
    getWeb3
      .then(web3 => {
        this.setState({
          web3,
        })

        web3.eth
          .getAccounts(function (error, accounts) {
            return accounts[0]
          })
          .then(account => {
            account = account[0].toLowerCase()
            this.setState({ account })
          })
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  async register() {
    let response = await AuthentificationService.login({
      web3: this.state.web3,
      account: this.state.account,
      signRoute: '/sign/',
      authRoute: '/register/',
      method: 'POST',
      body: null,
    })
      .catch(err => {
        console.log('Failed to login ...', err)
      })

    if (response) {
      console.log('JWT Token received', response.token)
      this.props.dispatch(login(response.token))
      /* this.props.router.push('/') */
      /* console.log(sessionStorage) */
    }
  }

  render() {
    return (
      <Link className={styles.navLink} onClick={this.register}>
        Register
      </Link>
    )
  }
}

export default withRouter(connect(null)(Register))

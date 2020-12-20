import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { login } from '../../AppActions'
import getWeb3 from '../../../../util/getWeb3'
import 'babel-polyfill'
import AuthentificationService from '../../AuthentificationService'
import styles from '../NavBar/NavBar.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null,
    }
    this.login = this.login.bind(this)
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

  async login() {
    let response = await AuthentificationService.login({
      web3: this.state.web3,
      account: this.state.account,
      signRoute: '/sign/',
      authRoute: '/login/',
      method: 'GET',
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
      <Link className={styles.navLink} onClick={this.login}>
        Login
      </Link>
    )
  }
}

export default withRouter(connect(null)(Login))

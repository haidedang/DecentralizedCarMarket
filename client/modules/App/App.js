import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import styles from './App.css'
// Components
import Helmet from 'react-helmet'
import NavBar from './components/NavBar/NavBar'

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMounted: false,
    }
  }

  componentDidMount() {
    this.setState({isMounted: true}) // eslint-disable-line
  }

  render() {
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development'}
        <div>
          <Helmet
            title="Crypto Ride"
            titleTemplate="%s - Car Marketplace"
            meta={[
              {charset: 'utf-8'},
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <div className={styles.container}>
            <div className={styles.navBarContainer}>
              <NavBar/>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
}

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  }
}

export default connect(mapStateToProps)(App)

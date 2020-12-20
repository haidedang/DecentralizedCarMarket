// Root component
import React from 'react'
import { Provider } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import IntlWrapper from './modules/Intl/IntlWrapper'

import routes from './routes'
// Global stylesheet
import './main.css'

export default function App(props) {
  return (
    <Provider store={props.store}>
      <IntlWrapper>
        <Router history={browserHistory}>{routes}</Router>
      </IntlWrapper>
    </Provider>
  )
}

App.propTypes = {
  store: React.PropTypes.object.isRequired,
}

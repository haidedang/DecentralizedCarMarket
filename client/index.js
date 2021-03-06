/**
 * Client entry point
 */
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import { configureStore } from './store'

const store = configureStore(window.__INITIAL_STATE__)
const mountApp = document.getElementById('root')

render(
  <AppContainer>
    <App store={store}/>
  </AppContainer>,
  mountApp,
)

// For hot reloading of react components
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextApp store={store}/>
      </AppContainer>,
      mountApp,
    )
  })
}

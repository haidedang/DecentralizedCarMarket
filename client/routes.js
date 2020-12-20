/* eslint-disable global-require */
import React from 'react'
import { IndexRoute, Route } from 'react-router'
import App from './modules/App/App'

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require)
  }
}

if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
}

export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Search/pages/SearchPage/SearchPage').default)
        })
      }}
    />,
    <Route
      path="/results"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Search/pages/ResultPage/ResultPage').default)
        })
      }}
    />,
    <Route
      path="/cars"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Car/pages/Cars').default)
        })
      }}
    />,
    <Route
      path="/offer/detail"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Offer/pages/OfferDetailPage/OfferDetailPage').default)
        })
      }}
    />,
    <Route
      path="/offer/start"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Offer/pages/OfferStartPage/OfferStartPage').default)
        })
      }}
    />,
    <Route
      path="/car/creation"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Car/pages/CreateCar').default)
        })
      }}
    />,
    <Route
      path="/offer/contact"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Offer/pages/OfferContactPage/OfferContactPage').default)
        })
      }}
    />,
    <Route
      path="/offer/car"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Offer/pages/OfferCarPage/OfferCarPage').default)
        })
      }}
    />,
    <Route
      path="/offer/:id"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Offer/pages/OfferOverviewPage/OfferOverviewPage').default)
        })
      }}
    />,
  </Route>
)

import * as AuthenticationController from '../controllers/authentication.controller'
import MetaAuth from 'meta-auth'

const metaAuth = new MetaAuth()

/**
 *  Contains all routes concerning authentication of a user.
 *
 * @param app
 */
module.exports = app => {
  app.get('/sign/:MetaAddress', metaAuth, AuthenticationController.sign)
  app.get('/login/:MetaMessage/:MetaSignature', metaAuth, AuthenticationController.authenticate)
  app.post('/register/:MetaMessage/:MetaSignature', metaAuth, AuthenticationController.register)
  app.get('/users/:user', AuthenticationController.profile)
}

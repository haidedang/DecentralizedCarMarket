import User from '../models/user'
import jwt from 'jsonwebtoken'

const secret = 'hhhhh'

module.exports = {

  async profile(req, res) {
    try {
      // This will create an Error if Email already exists.
      // Creating only possible if Ethereum ID exists.
      const user = await User.findOne({
        where: {
          userID: req.params.user,
        },
      })
      const userJson = user.toJSON()
      res.send({
        user: userJson,
      })
    } catch (err) {
      res.status(400)
        .send({
          error: 'This email account is already in use.',
        })
    }
  },

  async register(req, res) {
    try {
      // This will create an Error if Email already exists.
      // Creating only possible if Ethereum ID exists.
      if (isValidSignature(req)) {
        const newUser = new User({ address: req.metaAuth.recovered })
        newUser.save((err, result) => {
          if (err) {
            res.send({ error: 'You are already registered ' })
          } else {
            console.log(result)
            const userJson = result.toJSON()
            res.send({
              user: userJson,
              token: jwt.sign(userJson, secret),
            })
          }
        })
      }

    } catch (err) {
      res.status(400)
        .send({
          error: 'This email account is already in use.',
        })
    }
  },

  async sign(req, res) {
    try {
      if (req.metaAuth && req.metaAuth.challenge) {
        console.log('success')
        res.send(req.metaAuth.challenge)
      }
    } catch (err) {
      res.status(400)
        .send({
          error: 'MetaMask required!',
        })
    }
  },

  /**
   * Authenticate signature of user with meta-auth to prove that he is really the owner of the public address.
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async authenticate(req, res) {
    try {
      if (isValidSignature(req)) {
        console.log('Signature verified by meta-auth!')
        console.log(req.metaAuth.recovered)

        User.findOne({ address: req.metaAuth.recovered })
          .exec((err, user) => {
              if (err) {
                console.log('Couldn\'t find user')
                // Register a new user
                res.status(403)
                  .send({
                    error: 'The login information was incorrect',
                  })
              } else {
                if (user) {
                  console.log('Found user', user.toJSON())
                  const userJson = user.toJSON()
                  res.send({
                    user: userJson,
                    token: jwt.sign(userJson, secret),
                  })
                } else {
                  res.send({ message: 'User not Found' })
                }
              }
            },
          )
      } else {
        console.log('Invalid signature!')
        res.status(400)
          .send()
      }
    } catch (err) {
      res.status(400)
        .send({
          error: 'invalid address',
        })
    }
  },
}

/**
 * Signature is valid if meta-auth could successfully recover the message from the signature.
 *
 * @param req
 * @returns {*}
 */
function isValidSignature(req) {
  return req.metaAuth && req.metaAuth.recovered
}

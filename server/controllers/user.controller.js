import User from '../models/user'
import cuid from 'cuid'

/**
 * Get users.
 *
 * @param req
 * @param res
 */
export function getUsers(req, res) {
  User.find()
    .exec((err, users) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      res.json({ users })
    })
}

/**
 * Get user.
 *
 * @param req
 * @param res
 */
export function getUser(req, res) {
  User.findOne({ cuid: req.params.cuid })
    .exec((err, user) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      res.json({ user })
    })
}

/**
 * Add user.
 *
 * @param req
 * @param res
 */
export function addUser(req, res) {
  if (!req.body.post.name || !req.body.post.address || !req.body.post.email) {
    res.status(403)
      .end()
  }

  const newUser = new User(req.body.post)
  newUser.cuid = cuid()
  newUser.save((err, saved) => {
    if (err) {
      res.status(500)
        .send(err)
    }
    res.json({ user: saved })
  })
}

/**
 * Delete user.
 *
 * @param req
 * @param res
 */
export function deleteUser(req, res) {
  User.findOne({ cuid: req.params.cuid })
    .exec((err, user) => {
      if (err) {
        res.status(500)
          .send(err)
      }

      user.remove(() => {
        res.status(200)
          .end()
      })
    })
}

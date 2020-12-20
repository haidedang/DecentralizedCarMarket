import Offer from '../models/offer'

/**
 * Get offers.
 *
 * @param req
 * @param res
 */
export function getOffers(req, res) {
  Offer.find()
    .exec((err, offers) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      res.json({ offers })
    })
}

/**
 * Finds offer by cuid.
 *
 * @param req
 * @param res
 */
export function getOffer(req, res) {
  Offer.findOne({ _id: req.params.id })
    .exec((err, offer) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      res.json({ offer })
    })
}

/**
 * Finds offer by offer address.
 *
 * @param req
 * @param res
 */
export function getOfferByOfferAddress(req, res) {
  Offer.find({ offerAddress: req.params.offerAddress })
    .exec((err, offer) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      res.json({ offers: offer })
    })
}

/**
 * Finds offer by userId.
 *
 * @param req
 * @param res
 */
export function getOfferByUser(req, res) {
  Offer.findOne({ userId: req.params.userId })
    .exec((err, offer) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      res.json({ offer })
    })
}

/**
 * Add offer.
 *
 * @param req
 * @param res
 */
export function addOffer(req, res) {
  /* if (isValidOffer(req)) {
    res.status(403)
      .end()
  } */

  let ImageArray = req.files.map(item => item.path)
  let result = JSON.parse(req.body.offer)

  const newOffer = new Offer({
    carId: result.car.carId,
    description: result.detail.description,
    title: result.detail.title,
    images: ImageArray,
    price: result.detail.price,
    email: result.contact.email,
    userId: result.owner,
  })

  /* const newOffer = new Offer(req.body.post)
  newOffer.cuid = cuid() */
  newOffer.save((err, saved) => {
    if (err) {
      res.status(500)
        .send(err)
    }
    res.json({ offer: saved })
  })
}

/**
 * Delete offer.
 *
 * @param req
 * @param res
 */
export function deleteOffer(req, res) {
  Offer.findOne({ cuid: req.params.cuid })
    .exec((err, offer) => {
      if (err) {
        res.status(500)
          .send(err)
      }

      offer.remove(() => {
        res.status(200)
          .end()
      })
    })
}

export function getImage(req, res) {
  var options = {
    root: './',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  }

  Offer.findOne({ carId: req.params.carId })
    .exec((err, offer) => {
      if (err) {
        res.status(500)
          .send(err)
      }
      try {
        var fileName = offer.images[0].substring(offer.images[0].substring(offer.images[0].length - 8))
      } catch (err) {
        console.log(err)
        res.status(404)
          .send(err)
        return
      }
      res.sendFile(fileName, options, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Sent:', fileName)
        }
      })
    })
}

/**
 * Validates post request body.
 *
 * @returns {boolean}
 */
const isValidOffer = req => {
  return !req.body.post.title || !req.body.post.description || !req.body.post.offerAddress || !req.body.post.userId || !req.body.post.price || !req.body.post.images
}

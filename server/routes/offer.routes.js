import { Router } from 'express'
import * as OfferController from '../controllers/offer.controller'

const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  },
})

const upload = multer({ storage: storage })

const router = new Router()

// Get all Insertions
router.route('/offers')
  .get(OfferController.getOffers)

// Get one offer by cuid
router.route('/offer/:id')
  .get(OfferController.getOffer)

// Get one offer by userId
router.route('/offer/:userId')
  .get(OfferController.getOfferByUser)

// Add a new Offer
/* router.route('/offer')
  .post(OfferController.addOffer) */
router.post('/offer', upload.array('file'), OfferController.addOffer)

router.get('/offer/:carId/image', OfferController.getImage)

// Delete a offer by cuid
router.route('/offer/:cuid')
  .delete(OfferController.deleteOffer)

export default router

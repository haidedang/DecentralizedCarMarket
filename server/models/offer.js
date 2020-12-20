import mongoose from 'mongoose'

const Schema = mongoose.Schema

const offerSchema = new Schema({
  cuid: { type: 'String', required: false },
  title: { type: 'String', required: false },
  description: { type: 'String', required: false },
  carId: { type: 'String', required: false },
  // the offer's address in Ethereum
  offerAddress: { type: 'String', required: false },
  // id of user document
  userId: { type: 'String', required: false },
  // it's price in €
  price: { type: 'String', required: false },
  // array of image urls
  images: [{ type: 'String' }],
  firstName: { type: 'String' },
  lastName: { type: 'String' },
  address: { type: 'String' },
  number: { type: 'String' },
  zipCode: { type: 'String' },
  place: { type: 'String' },
  country: { type: 'String' },
  email: { type: 'String' },
})

export default mongoose.model('Offer', offerSchema)

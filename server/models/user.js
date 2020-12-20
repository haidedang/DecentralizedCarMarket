import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  address: { type: 'String', required: true, unique: true },
  name: { type: 'String', required: false },
  email: { type: 'String', required: false },
})

export default mongoose.model('User', userSchema)

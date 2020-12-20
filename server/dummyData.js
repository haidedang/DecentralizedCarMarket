import User from './models/user'
import Offer from './models/offer'
import cuid from 'cuid'

const addUser = function () {
  console.log('Setting up dummy data for user and offers ...')
  User.count()
    .exec((err, count) => {
      if (count > 0) {
        console.log('Users already set up.')
        return
      }

      const buyer = new User({
        name: 'Some dude without a car',
        address: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
        email: 'some.dude@gmail.com',
        cuid: cuid(),
      })

      const seller = new User({
        name: 'Gottlieb Automobile',
        address: 'asdafxysdfa',
        email: 'gottlieb.automobile@gmail.com',
        cuid: cuid(),
      })

      User.create([buyer, seller], error => {
        if (!error) {
          console.log('Added users ...')
        }
      })
    })

  console.log('Setting up offers ...')
  Offer.count()
    .exec((err, count) => {
      if (count > 0) {
        console.log('Insertions already set up.')
        return
      }

      User.findOne({ address: '0x627306090abab3a6e1400e9345bc60c78a8bef57' })
        .exec((err, user) => {
          if (err) {
            console.log(err)
          } else {
            const offer = new Offer({
              cuid: cuid(),
              title: 'Lambo',
              description: 'this is a nice and friendly family car',
              offerAddress: 'ASDADASDASDAS',
              userId: user.cuid,
              price: '20,000',
              images: [],
            })

            Offer.create([offer], error => {
              if (error) {
                console.log(error)
              } else {
                console.log('Added Lambo to Mongo ...')
              }
            })
          }
        })
    })
}

export default function () {
  addUser()
}

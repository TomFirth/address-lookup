const address = require('../controllers/address')
const postcode = require('../controllers/postcode')
const errors = require('../config/errors')

const env = process.env.NODE_ENV || 'development'
if (env === 'development') require('dotenv').config()

module.exports = (app) => {
  app.get('/', (req, res) => {
    // show request stats
    // show provider status
    res.status(200).json({ usage: [
      '/address/{ADDRESSID}',
      '/postcode/{POSTCODE}'
    ] })
  })

  app.get('/address/:addressId', async (req, res) => {
    try {
      if (!req.params.addressId) res.status(404).json({ error: 'no_address' })
      const result = await address.execute(req.params.addressId)
      res.status(200).json(result)
    } catch (e) {
      const error = errors[e.message]
      res.status(500).json({ error })
    }
  })

  app.get('/postcode/:postcode', async (req, res) => {
    try {
      if (!req.params.postcode) res.status(404).json({ error: 'no_postcode' })
      const result = await postcode.execute(req.params.postcode)
      res.status(200).json(result)
    } catch (e) {
      const error = errors[e.message]
      res.status(500).json({ error })
    }
  })
}

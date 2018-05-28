const address = require('../controllers/address')

const env = process.env.NODE_ENV || 'development'
if (env === 'development') require('dotenv').config()

module.exports = (app) => {
  app.get('/', (req, res) => {
    // show request stats
    // show provider status
    res.status(200).json({ usage: '/address?postcode={POSTCODE}' })
  })

  app.get('/address', async (req, res) => {
    try {
      if (!req.query.postcode) res.status(404).json({ error: 'no postcode input' })
      const result = await address.execute(req.query.postcode)
      res.status(200).json(result)
    } catch (error) {
      res.status(error.status).json({ error })
    }
  })
}

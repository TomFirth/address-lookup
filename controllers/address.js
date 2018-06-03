const po = require('./postcode')

if (process.argv.NODE_ENV === 'development') require('dotenv').config()

const cache = require('../lib/cache')
const providers = require('../lib/providers')

const ad = module.exports = {}

ad.execute = async (addressId) => {
  const addressParts = addressId.split(':')
  const normalisedPostcode = po.normalisePostcode(addressParts[0])
  const cacheExist = await cache.read(normalisedPostcode)
  if (cacheExist) return cacheExist
  const provider = await providers.cycle()
  const buildRequest = await po.buildRequest(provider, normalisedPostcode)
  const result = await po.getAddressFromSupplier(buildRequest)
  return ad.buildResponse(result, normalisedPostcode, addressParts[1])
}

ad.buildResponse = (addresses, postcode, id) => {
  if (!addresses) throw new Error('no_input')
  const address = addresses[id]
  const addressParts = address.split(', ')
  return {
    line1: addressParts[0] || '',
    line2: addressParts[1] || '',
    line3: addressParts[2] || addressParts[3] || addressParts[4] || '',
    line4: addressParts[3] || '',
    locality: addressParts[4] || '',
    town: addressParts[5] || '',
    county: addressParts[6] || '',
    postcode: postcode
  }
}

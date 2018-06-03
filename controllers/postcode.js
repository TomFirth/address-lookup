const request = require('request-promise-native')

if (process.argv.NODE_ENV === 'development') require('dotenv').config()

const cache = require('../lib/cache')
const providers = require('../lib/providers')

const po = module.exports = {}

po.execute = async (postcode) => {
  const normalisedPostcode = po.normalisePostcode(postcode)
  const cacheExist = await cache.read(normalisedPostcode)
  if (cacheExist) return cacheExist
  const provider = await providers.cycle()
  const buildRequest = await po.buildRequest(provider, normalisedPostcode)
  const result = await po.getAddressFromSupplier(buildRequest)
  return po.buildResponse(result, normalisedPostcode)
}

po.normalisePostcode = (postcode) => {
  postcode = postcode.replace(/[^0-9a-z]/gi, '').toUpperCase()
  const postcodeParts = postcode.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/)
  if (!postcodeParts) throw new Error('sanitisation')
  postcodeParts.shift()
  return postcodeParts.join(' ')
}

po.buildRequest = async (provider, postcode) => {
  try {
    var replace = {
      '{POSTCODE}': postcode,
      '{API_KEY}': process.env[`${provider.name}_API_KEY`]
    }
    return provider.endpoint.replace(/{POSTCODE}|{API_KEY}/gi, (matched) => {
      return replace[matched]
    })
  } catch (error) {
    throw new Error('build_request')
  }
}

po.getAddressFromSupplier = async (url) => {
  try {
    return await request.get({
      url,
      json: true
    })
  } catch (error) {
    console.error(error)
    throw new Error('third_party')
  }
}

po.buildResponse = (addresses, postcode) => {
  if (!addresses) throw new Error('build_response')
  const response = addresses.Addresses.map(address => {
    const addressParts = address.split(', ')
    const addressSummary = addressParts.filter(part => Boolean(part)).join(' ') + ' ' + postcode
    return {
      line1: addressParts[0] || '',
      line2: addressParts[1] || '',
      line3: addressParts[2] || addressParts[3] || addressParts[4] || '',
      line4: addressParts[3] || '',
      locality: addressParts[4] || '',
      town: addressParts[5] || '',
      county: addressParts[6] || '',
      postcode: postcode,
      summary: addressSummary
    }
  })
  cache.save(postcode, response)
  return response
}

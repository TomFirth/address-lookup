const request = require('request-promise-native')

if (process.argv.NODE_ENV === 'development') require('dotenv').config()

const cache = require('../lib/cache')
const providers = require('../lib/providers')

module.exports.execute = async (postcode) => {
  const normalisedPostcode = _normalisePostcode(postcode)
  const cacheExist = await cache.read(normalisedPostcode)
  if (cacheExist) return cacheExist
  const provider = await providers.cycle()
  const buildRequest = await _buildRequest(provider, normalisedPostcode)
  const result = await _getAddressFromSupplier(buildRequest)
  return _buildResponse(result, normalisedPostcode)
}

function _normalisePostcode (postcode) {
  postcode = postcode.replace(/[^0-9a-z]/gi, '').toUpperCase()
  const postcodeParts = postcode.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/)
  if (!postcodeParts) throw new Error('Postcode failed sanitisation')
  postcodeParts.shift()
  return postcodeParts.join(' ')
}

async function _buildRequest (provider, postcode) {
  var replace = {
    '{POSTCODE}': postcode,
    '{API_KEY}': process.env[`${provider.name}_API_KEY`]
  }
  return provider.endpoint.replace(/{POSTCODE}|{API_KEY}/gi, (matched) => {
    return replace[matched]
  })
}

async function _getAddressFromSupplier (url) {
  try {
    return await request.get({
      url,
      json: true
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

function _buildResponse (addresses, postcode) {
  if (!addresses || !postcode) throw new Error('Incorrect input found')
  const response = addresses.addresses.map(address => {
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

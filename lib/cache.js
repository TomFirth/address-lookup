const flatCache = require('flat-cache')
var client = flatCache.load('address-lookup')

const cache = module.exports = {}
cache.save = async (key, obj) => {
  client.setKey(key, obj)
}

cache.read = async (key) => {
  return client.getKey(key)
}

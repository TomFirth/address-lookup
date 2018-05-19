const config = require('../config/config')

let apiArray = []

const providers = module.exports = {}

providers.cycle = async () => {
  const apis = config.providers
  for (const api in apis) {
    if (apis[api].inService) {
      return apis[api]
    }
  }
  return apiArray[0]
}

providers.ping = async => {
  // check the provider exists and is working
}

const config = require('../config/config')

const providers = module.exports = {}

providers.cycle = async () => {
  const apis = config.providers
  for (const api in apis) {
    if (apis[api].inService) {
      // const limit = await providers._limit(apis)
      // const ping = await providers._ping(apis[api])
      return apis[api]
    }
  }
  throw new Error('no_providers')
}

providers._ping = async (api) => {
  // check the provider exists and is working
}

providers._limit = async (api) => {
  // check if limit has been exceeded
}

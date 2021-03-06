const jsonFile = require('jsonfile')

const SOURCE_FRONTEND_CONFIG_FILE = './config/default.json'
// NODE_CONFIG_ENV variable will be used as the name of the environment configuration
// This will override default.json file but will let it be overridden by local.json
// If NODE_CONFIG_ENV is not set, then it will just create a local configuration directly
const TARGET_FRONTEND_CONFIG_FILE = process.env.NODE_CONFIG_ENV ? `./config/${process.env.NODE_CONFIG_ENV}.json` : './config/local.json'

function loadSourceConfig (source = SOURCE_FRONTEND_CONFIG_FILE) {
  try {
    // We use SOURCE_FRONTEND_CONFIG_FILE as the basis for our
    const config = jsonFile.readFileSync(source)
    let graphQlPort = 8080
    const backendPath = process.env.VUE_STORE_API_HOST || 'localhost:8080'
    const graphQlHost = (process.env.GRAPHQL_HOST || 'localhost').replace('https://', '').replace('http://', '')
    //  These are the configuration values generated by installer.js
    config.graphql.host = graphQlHost
    config.graphql.port = graphQlPort
    config.elasticsearch.host = `${backendPath}/api/catalog`
    config.orders.endpoint = `${backendPath}/api/order`
    config.products.endpoint = `${backendPath}/api/product`
    config.users.endpoint = `${backendPath}/api/user`
    config.users.history_endpoint = `${backendPath}/api/user/order-history?token={{token}}`
    config.users.resetPassword_endpoint = `${backendPath}/api/user/reset-password`
    config.users.changePassword_endpoint = `${backendPath}/api/user/change-password?token={{token}}`
    config.users.login_endpoint = `${backendPath}/api/user/login`
    config.users.create_endpoint = `${backendPath}/api/user/create`
    config.users.me_endpoint = `${backendPath}/api/user/me?token={{token}}`
    config.users.refresh_endpoint = `${backendPath}/api/user/refresh`
    config.stock.endpoint = `${backendPath}/api/stock`
    config.cart.create_endpoint = `${backendPath}/api/cart/create?token={{token}}`
    config.cart.updateitem_endpoint = `${backendPath}/api/cart/update?token={{token}}&cartId={{cartId}}`
    config.cart.deleteitem_endpoint = `${backendPath}/api/cart/delete?token={{token}}&cartId={{cartId}}`
    config.cart.pull_endpoint = `${backendPath}/api/cart/pull?token={{token}}&cartId={{cartId}}`
    config.cart.totals_endpoint = `${backendPath}/api/cart/totals?token={{token}}&cartId={{cartId}}`
    config.cart.paymentmethods_endpoint = `${backendPath}/api/cart/payment-methods?token={{token}}&cartId={{cartId}}`
    config.cart.shippingmethods_endpoint = `${backendPath}/api/cart/shipping-methods?token={{token}}&cartId={{cartId}}`
    config.cart.shippinginfo_endpoint = `${backendPath}/api/cart/shipping-information?token={{token}}&cartId={{cartId}}`
    config.cart.collecttotals_endpoint = `${backendPath}/api/cart/collect-totals?token={{token}}&cartId={{cartId}}`
    config.cart.deletecoupon_endpoint = `${backendPath}/api/cart/delete-coupon?token={{token}}&cartId={{cartId}}`
    config.cart.applycoupon_endpoint = `${backendPath}/api/cart/apply-coupon?token={{token}}&cartId={{cartId}}&coupon={{coupon}}`
    config.reviews.create_endpoint = `${backendPath}/api/review/create?token={{token}}`
    if (config.mailchimp) {
      config.mailchimp.endpoint = `${backendPath}/api/ext/mailchimp-subscribe/subscribe`
    }
    config.mailer.endpoint.send = `${backendPath}/api/ext/mail-service/send-email`
    config.mailer.endpoint.token = `${backendPath}/api/ext/mail-service/get-token`
    config.cms.endpoint = `${backendPath}/api/ext/cms-data/cms{{type}}/{{cmsId}}`
    config.cms.endpointIdentifier = `${backendPath}/api/ext/cms-data/cms{{type}}Identifier/{{cmsIdentifier}}/storeId/{{storeId}}`
    // Endpoint of store images is either loaded through an env variable or in the /img folder of backend
    config.images.baseUrl = process.env.IMAGES_ENDPOINT || `${backendPath}/img/`

    // Endpoints for default storeviews are updated as well
    config.storeViews.de.elasticsearch.host = `${backendPath}/api/catalog`
    config.storeViews.it.elasticsearch.host = `${backendPath}/api/catalog`

    return config
  } catch (e) {
    throw e
  }
}

function createConfig (targetFile = TARGET_FRONTEND_CONFIG_FILE, fileConfig) {
  return new Promise((resolve, reject) => {
    let config
    console.log(`Creating storefront config '${TARGET_FRONTEND_CONFIG_FILE}'...`)
    try {
      if (!fileConfig) {
        config = loadSourceConfig()
      } else {
        config = fileConfig
      }
      // New configuration is created
      jsonFile.writeFileSync(TARGET_FRONTEND_CONFIG_FILE, config, {spaces: 2})
      console.log(`Configuration for ${process.env.NODE_CONFIG_ENV || 'local'} environment generated!`)
    } catch (e) {
      console.log(`Error creating configuration: ${e}`)
      reject(new Error('Can\'t create storefront config.'))
    }
    resolve()
  })
}

if (require.main.filename === __filename) {
  // We execute the createConfig function
  createConfig()
    .then()
    .catch((e) => {
      console.log(e)
    })
} else {
  module.exports.loadSourceConfig = loadSourceConfig
  module.exports.createConfig = createConfig
}

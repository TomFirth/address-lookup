const express = require('express')
const app = express()

const port = process.env.PORT || 12345

app.listen(port, () => {
  console.log(`${port} r belong to us`)
})

require('./routes')(app)

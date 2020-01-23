/**
 * Configure and connects to the database.
 * @module database The pseudo-promisse returned by mongoose.connect(uri, options) properly configured.
 */

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const DATABASE_NAME = 'node-mongo-auth-rest-api'
const CONNECTION_URI = `mongodb://localhost/${DATABASE_NAME}`

module.exports = mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
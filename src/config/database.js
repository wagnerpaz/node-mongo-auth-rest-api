/**
 * Configure and connects to the database.
 * @module database The pseudo-promisse returned by mongoose.connect(uri, options) properly configured.
 */

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const DATABASE_NAME = 'node-mongo-auth-rest-api'
const CONNECTION_URI = `mongodb://localhost/${DATABASE_NAME}`

mongoose.connection.on('connected', () => {
    console.log('Connected to mongodb instance.')
})
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongodb: ', err)
})

try {
    module.exports = mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
}
catch(err) {
    console.log('Error connecting to mongodb: ', err)
}
const PORT = 3003

const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const allowCors = require('./cors')

//SOLVE DEPRECATION WARNING: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);

const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(allowCors)

server.listen(PORT, () => {
    console.log(`BACKEND is running on port ${PORT}`)
})

module.exports = server
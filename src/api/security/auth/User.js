/**
 * @module userModel The mongoose RESTFUL prepared model of a User
 */

const COLLECTION_NAME = 'security.auth.users'

const crypto = require('crypto')
const restful = require('node-restful')
const mongoose = restful.mongoose

const authCfg = require('../../../config/authConfig')
const errorHandler = require('../../common/errorHandler')

//USER SCHEMA
const schema = new mongoose.Schema({
     name: {
          type: String,
     },
     email: {
          type: String,
          required: true,
          unique: true,
          validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
     },
     password: {
          type: String,
          required: true,
     },
     blacklistedTokens: [{
          token: String,
          exp: Number,
     }],
})

const hash = (password) => {
     const hash = crypto.createHash(authCfg.passwordHashAlgorithm)
     hash.update(password)
     return hash.digest('hex')
}

//used a function instead of arrow function to get access to 'this' from User 
schema.pre('save', function(next) {
     const user = this
     if(!user.isModified('password')) {
          return next()
     }
     user.password = hash(user.password)
     next()
});
 
//used a function instead of arrow function to get access to 'this' from User 
schema.methods.comparePassword = function(candidatePassword) {
     const user = this
     return candidatePassword && user.password === hash(candidatePassword)
};

const model = restful.model(COLLECTION_NAME, schema);

model.methods(['get', 'post', 'put', 'delete'])
model.updateOptions({new: true, runValidators: true})
model.after('post', errorHandler)
model.after('put', errorHandler)

module.exports = model;
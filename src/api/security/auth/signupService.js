/**
 * @module signupService Express handler function responsible
 * for sign up users in the API.
 */

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const authCfg = require('../../../config/authConfig')
const User = require('./User')

module.exports = async (req, res, next) => {
    const {email, password} = req.body
    
    const errors = []
    if(!email) errors.push({kind: 'required', path: 'email', message: 'Path `email` is required.'})
    if(!password) errors.push({kind: 'required', path: 'password', message: 'Path `password` is required.'})
    
    if (errors.length > 0) {
        res.status(422).send({errors}).end()
        return
    }
    
    try {
        const user = new User({email, password})
        await user.save()
        
        const token = jwt.sign({
            sub: user._id,
            email: user.email,
            name: user.name,
        }, authCfg.tokenSecretKey, {expiresIn: `${authCfg.tokenExpirationSecs}s`})
        res.send({token}).end()
    }
    catch(err) {
        res.status(422).send({
            errors: [{
                message: 'Sign up failed. Cannot sign in with this data.'
            }]
        })
    }
}
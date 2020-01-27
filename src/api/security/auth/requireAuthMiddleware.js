/**
 * @module requireAuth Express middleware responsible for authorizing requests.
 */

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const authCfg = require('../../../config/authConfig')
const User = require('./User')

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const authHeaderSplit = authHeader ? authHeader.split(' ') : []
    const token = authHeaderSplit.length > 1 ? authHeaderSplit[1] : null

    if(token) {
        jwt.verify(token, authCfg.tokenSecretKey, async (err, decoded) => {
            if(!err) {
                const user = await User.findOne({
                    _id: mongoose.Types.ObjectId(decoded.sub),
                })

                const userWithBlacklistedToken = await User.findOne({
                    _id: mongoose.Types.ObjectId(decoded.sub),
                    blacklistedTokens: { $elemMatch: { token: { $eq: token} } }
                })

                if(user && !userWithBlacklistedToken) {
                    res.locals.token = token
                    res.locals.tokenDecoded = decoded
                    next()
                }
                else {
                    res.send({
                        errors: [{
                            message: "The token used in this request is invalid."
                        }]
                    }).end()
                }
            }
            else {
                res.send({
                    errors: [err]
                }).end()
            }
        })
    }
    else {
        res.send({
            errors: [{
                message: 'Auth error: JWT Token required.'
            }]
        }).end()
    }
}
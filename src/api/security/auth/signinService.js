/**
 * @module signinService Express handler function responsible
 * for sign in users in the API.
 */

const jwt = require('jsonwebtoken')

const authCfg = require('../../../config/authConfig')
const User = require('./User')

module.exports = (req, res, next) => {
    const {email, password} = req.body

    const errors = []
    if(!email) errors.push({kind: 'required', path: 'email', message: 'Path `email` is required.'})
    if(!password) errors.push({kind: 'required', path: 'password', message: 'Path `password` is required.'})

    if (errors.length > 0) {
        res.status(422).send({errors}).end()
        return
    }

    const queryUser = {email};

    User.findOne(queryUser, (err, user) => {
        if(user && user.comparePassword(password)) {
            const token = jwt.sign({
                sub: user._id,
                email: user.email,
                name: user.name,
            }, authCfg.tokenSecretKey, {expiresIn: `${authCfg.tokenExpirationSecs}s`})

            //REMOVES ANY BLACKLISTED TOKEN THAT HAS EXPIRED
            User.updateOne(queryUser, {
                $pull: { blacklistedTokens: { exp: { $lt: Math.floor(Date.now() / 1000) } } }
            })

            res.send({token}).end()
            return
        }
        else {
            res.status(422).send({
                errors: {
                    message: "Sign in failed. Email or password are incorrect."
                }
            }).end()
            return
        }
    })
}
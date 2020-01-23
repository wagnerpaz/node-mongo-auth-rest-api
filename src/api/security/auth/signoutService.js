/**
 * @module signoutService Express handler function responsible for sign out users in the API.
 */

const User = require('./User')

module.exports = async (req, res, next) => {
    const token = res.locals.token
    const tokenDecoded = res.locals.tokenDecoded

    try {
        await User.updateOne({ _id: tokenDecoded.sub }, {
            $push: {
                blacklistedTokens: {
                     token,
                     exp: tokenDecoded.exp
                }
            }
        })
        res.end()
    }
    catch(err) {
        res.status(500).send({
            errors: [{
                message: 'Sign out failed.',
            }]
        }).end()
    }
}
/**
 * @module authRoutes Apply the authorization routes to a server instance.
 */

const express = require('express')
const requireAuth = require('../api/security/auth/requireAuthMiddleware');

module.exports = (server) => {
    const router = express.Router()
    server.use('/api', router)
    
    router.post('/signup', require('../api/security/auth/signupService'))
    router.post('/signin', require('../api/security/auth/signinService'))
    router.post('/signout', requireAuth, require('../api/security/auth/signoutService'))
    
    const securityUsers = require('../api/security/auth/User')
    securityUsers.register(router, requireAuth, '/security/users')
}
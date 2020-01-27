/**
 * @module authRoutes Apply the default route to a server instance.
 */

module.exports = server => server.use( (req, res) => {
    res.status(404).send({
        errors: [{
            message: 'Invalid path/method.',
        }]
    }).end()
})
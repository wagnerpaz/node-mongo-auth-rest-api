require('./config/database')
const server = require('./config/server')
require('./config/authRoutes')(server)
require('./config/defaultRoute')(server)

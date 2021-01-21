const express = require('express')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const postsRouter = require('./postsRouter')

const appRoot = path.dirname(require.main.filename)

/**
 * Initalizes the express app
 * @returns the express app
 */
function init () {
  const app = express()

  const apiLimiter = rateLimit({
    windowMs: 1000 , 
    max: 60 // limit each IP to 60 requests a second
  })

  app.use(cors()) // Here we enable cors
  app.use(helmet()) // helmet is a medley of security middleware to better protect our app
  app.use(express.json()) // Built in body-parser for reading request JSON bodies
  app.use('/api/', apiLimiter) // use the apiLimiter only on routes beginning with /api
  app.use(express.static(path.join(appRoot, '/build'))) // host the static files built from React
  app.use('/api/posts', postsRouter)

  // If the route cannot be identified, send the index.html file and let react router route instead
  app.get('*', function (req, res) {
    res.sendFile(path.join(appRoot, '/build/index.html'), function (err) {
      if (err) {
        res.redirect('/')
      }
    })
  })

  return app
}

module.exports = init
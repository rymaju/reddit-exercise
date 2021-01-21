const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const postsRouter = require('./postsRouter')
const path = require('path')
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
  app.use('/api/posts', postsRouter)

  return app
}

module.exports = init
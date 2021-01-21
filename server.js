const init = require('./src_backend/initializeExpress')

// setup the express server
const app = init()
const port = process.env.PORT || 5000

if (process.env.HEROKU === 'true') {
    app.set('trust proxy', 1)
}
// launch the express server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})


const init = require('./src_backend/initializeExpress')
const express = require('express')
const path = require('path')

// setup the express server
const app = init()
const port = process.env.PORT || 5000

if (process.env.HEROKU === 'true') {
    app.set('trust proxy', 1)
}
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.set('Content-Security-Policy', '')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// launch the express server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})


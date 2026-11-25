// Entry point: start the HTTP server.
// app.js builds the app, this file only listens (makes testing easier).
import app from './app.js'
import { config } from './config.js'

app.listen(config.port, () => {
  console.log(`Express running on http://localhost:${config.port}`)
})

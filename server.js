import express from 'express'
import registerRouter from './router'

async function createServer() {
  const port = 5173
  const app = express()
  registerRouter(app)

  app.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log(`Listening at http://localhost:${port} \n`)
  })
}

createServer()

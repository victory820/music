import express from 'express'
import registerRouter from './router'

async function createServer () {
  console.log('creating....')
  const app = express()
  registerRouter(app)

  app.listen(5173, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('Listening at http://localhost:5173' + '\n')
  })
}

createServer()
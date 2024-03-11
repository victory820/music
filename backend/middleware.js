import registerRouter from './router'

export const registerRoutesPlugin = {
  name: 'register-routes',
  configureServer (server) {
    registerRouter(server.middlewares)
  }
}

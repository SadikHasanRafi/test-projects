// Entry point: build the app and start listening
import { buildApp } from './app.js'
import { config } from './config.js'

const app = buildApp()
await app.listen({ port: config.port })
console.log(`Fastify running on http://localhost:${config.port}`)

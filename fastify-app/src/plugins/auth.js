// Plugin: adds `fastify.requireToken`, used as a hook on protected routes.
import fp from 'fastify-plugin'

async function authPlugin(fastify, options) {
  fastify.decorate('requireToken', async (request, reply) => {
    if (request.headers.authorization !== `Bearer ${options.token}`) {
      return reply.code(401).send({ error: 'Unauthorized' }) // stops the request here
    }
  })
}

export default fp(authPlugin)

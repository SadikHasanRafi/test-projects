// Fastify validates with JSON Schema, built in. No extra library needed.
export const bookBody = {
  type: 'object',
  required: ['title', 'author'],
  additionalProperties: false, // unknown fields are removed
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 100 },
    author: { type: 'string', minLength: 1, maxLength: 100 },
    year: { type: ['integer', 'null'], minimum: 0, maximum: 2100 },
  },
}

export const idParams = {
  type: 'object',
  properties: { id: { type: 'integer' } }, // "5" in the URL becomes the number 5
}

export const listQuery = {
  type: 'object',
  properties: { author: { type: 'string' } },
}

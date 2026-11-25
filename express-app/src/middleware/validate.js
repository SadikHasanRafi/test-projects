import { z } from 'zod'

// Middleware factory: validate(schema) returns a middleware for that schema
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: z.flattenError(result.error).fieldErrors,
    })
  }
  req.body = result.data // only the known, validated fields
  next()
}

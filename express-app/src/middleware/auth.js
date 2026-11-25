import { config } from '../config.js'

// Protects a route: needs the header "Authorization: Bearer <API_TOKEN>"
// (A simple shared token. Real apps use JWT or sessions.)
export function requireToken(req, res, next) {
  if (req.headers.authorization !== `Bearer ${config.apiToken}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

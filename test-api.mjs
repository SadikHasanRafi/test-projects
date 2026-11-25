// Checks every endpoint of one app. Needs Node 18+, no packages.
// Usage: node test-api.mjs <port>      e.g. node test-api.mjs 4003
// It creates two books and deletes them again.
const port = process.argv[2] ?? '4000'
const base = `http://localhost:${port}`
const names = { 4000: 'Express', 4001: 'Fastify', 4002: 'NestJS', 4003: 'FastAPI', 4004: 'Django', 4005: 'Laravel', 4006: 'ASP.NET Core' }
const name = names[port] ?? `port ${port}`
const auth = { Authorization: 'Bearer secret123', Accept: 'application/json' }
let fails = 0
async function call(method, path, { body, headers = auth } = {}) {
  if (body !== undefined) headers = { ...headers, 'Content-Type': 'application/json' }
  const res = await fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  const text = await res.text()
  let json; try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, json }
}
function check(label, cond, got) { if (!cond) { fails++; console.log(`  FAIL ${label}:`, JSON.stringify(got).slice(0, 300)) } else console.log(`  ok   ${label}`) }

let r
try { r = await call('GET', '/') } catch { console.log(`Nothing is running on ${base}. Start the app first.`); process.exit(1) }
 check('GET / hello', r.status === 200 && r.json.message?.startsWith('Hello from'), r)
r = await call('GET', '/books'); check('GET /books list', r.status === 200 && Array.isArray(r.json) && r.json.length >= 2, r)
const first = r.json[0]; check('book shape', first && ['id','title','author','year'].every(k => k in first), first)
r = await call('GET', '/books?author=martin'); check('GET /books?author= filter', r.status === 200 && r.json.length >= 1 && r.json.every(b => /martin/i.test(b.author)), r)
r = await call('GET', `/books/${first.id}`); check('GET /books/:id', r.status === 200 && r.json.title === first.title, r)
r = await call('GET', '/books/99999'); check('GET missing -> 404', r.status === 404, r)
r = await call('GET', '/nope'); check('unknown route -> 404', r.status === 404, r)
r = await call('POST', '/books', { body: { title: 'X', author: 'Y' }, headers: { Accept: 'application/json' } }); check('POST no token -> 401', r.status === 401, r)
r = await call('POST', '/books', { body: { title: 'X', author: 'Y' }, headers: { ...auth, Authorization: 'Bearer wrong' } }); check('POST bad token -> 401', r.status === 401, r)
r = await call('POST', '/books', { body: { author: 'Y' } }); check('POST missing title -> 400/422', [400, 422].includes(r.status), r)
r = await call('POST', '/books', { body: { title: 'X', author: 'Y', year: 5000 } }); check('POST bad year -> 400/422', [400, 422].includes(r.status), r)
r = await call('POST', '/books', { body: { title: 'Refactoring', author: 'Martin Fowler', year: 1999 } }); check('POST create -> 201', r.status === 201 && r.json.id && r.json.title === 'Refactoring', r)
const id = r.json.id
r = await call('POST', '/books', { body: { title: 'No Year', author: 'Anon' } }); check('POST without year -> 201, year null', r.status === 201 && r.json.year === null, r)
const id2 = r.json.id
r = await call('PUT', `/books/${id}`, { body: { title: 'Refactoring 2e', author: 'Martin Fowler', year: 2018 } }); check('PUT update', r.status === 200 && r.json.year === 2018 && r.json.title === 'Refactoring 2e', r)
r = await call('PUT', '/books/99999', { body: { title: 'a', author: 'b' } }); check('PUT missing -> 404', r.status === 404, r)
r = await call('DELETE', `/books/${id}`, { headers: { Accept: 'application/json' } }); check('DELETE no token -> 401', r.status === 401, r)
r = await call('DELETE', `/books/${id}`); check('DELETE -> 204', r.status === 204, r)
await call('DELETE', `/books/${id2}`)
r = await call('GET', `/books/${id}`); check('deleted is gone', r.status === 404, r)
r = await call('DELETE', `/books/${id}`); check('DELETE missing -> 404', r.status === 404, r)
console.log(fails ? `${name}: ${fails} FAILED` : `${name}: all passed`)
process.exit(fails ? 1 : 0)

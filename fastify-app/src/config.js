// All settings in one place. Values come from .env (see .env.example).
export const config = {
  port: Number(process.env.PORT ?? 4001),
  apiToken: process.env.API_TOKEN ?? 'secret123',
  dbFile: process.env.DB_FILE ?? 'database.sqlite',
}

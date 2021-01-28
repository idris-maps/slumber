import { config } from 'dotenv'

config()

const get = (d: string): string => {
  if (!process.env[d]) {
    throw new Error(`Missing environment variable ${d}`)
  }
  return String(process.env[d])
}

export default {
  dbUrl: get('DATABASE_URL'),
  dbSchema: get('DATABASE_SCHEMA'),
}

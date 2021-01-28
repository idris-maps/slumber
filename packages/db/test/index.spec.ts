import test from 'ava'
import { config } from 'dotenv'
import Db from '../src'

config()

test('init db', async t => {
  if (!process.env.DATABASE_URL) {
    t.fail('DATABASE_URL is not defined')
  }

  const db = new Db(process.env.DATABASE_URL || '')
  const res = await db.run('SELECT 1 AS one')
  t.deepEqual(res, [{ one: 1 }])
})

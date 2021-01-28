import Db from '@slumber/db'
import env from '../env'

const GET_ID = `
  SELECT id, schema FROM ${env.dbSchema}.collections
  WHERE name = $1
  LIMIT 1
`

const getId = (db: Db) =>
  async (collection: string): Promise<number | undefined> => {
    const r = (await db.run<{ id: number }>(GET_ID, [collection]))[0]
    if (!r || !r.id) { return undefined }
    return r.id
  }

const GET = `
  SELECT id, schema FROM ${env.dbSchema}.collections
  WHERE name = $1
  LIMIT 1
`

const get = (db: Db) =>
  async (collection: string): Promise<{ id: number, schema: any } | undefined> => {
    const r = (await db.run<{ id: number, schema: any }>(GET_ID, [collection]))[0]
    if (!r || !r.id) { return undefined }
    return r
  }

export default {
  get,
  getId,
}

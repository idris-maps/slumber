import Db from '@slumber/db'
import { keys, pathOr } from 'ramda'
import env from '../env'

const GET_ACCESS = `
  SELECT
  get,
  post,
  patch,
  put,
  delete
  FROM ${env.dbSchema}.access, ${env.dbSchema}.keys
  WHERE ${env.dbSchema}.access.key_id = ${env.dbSchema}.keys.id
  AND ${env.dbSchema}.keys.key = $1
  AND ${env.dbSchema}.keys.deleted_at IS NULL
  AND ${env.dbSchema}.access.deleted_at IS NULL
  AND collection_id = $2
`

interface Methods {
  get: boolean
  post: boolean
  patch: boolean
  put: boolean
  delete: boolean
}

const toStrings = (d?: Methods) =>
  keys(d)
    .filter(key => pathOr<boolean>(false, [key], d))
    
const getAllowedMethods = (db: Db) =>
  async (collectionId: number, key: string) => {
    const methods = (await db.run<Methods>(GET_ACCESS, [key, collectionId]))[0]
    return toStrings(methods)
  }

export default {
  getAllowedMethods,
}

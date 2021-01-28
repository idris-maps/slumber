import Db from '@slumber/db'
import msg from './messages'

const getKey = (schema: string) => `
  SELECT id, comment FROM ${schema}.keys
  WHERE key = $1
  AND deleted_at IS NULL
  LIMIT 1
`

const getAccess = (schema: string) => `
  SELECT
  ${schema}.collections.name AS collection,
  ${schema}.access.get,
  ${schema}.access.post,
  ${schema}.access.patch,
  ${schema}.access.put,
  ${schema}.access.delete
  FROM ${schema}.access, ${schema}.collections
  WHERE ${schema}.access.collection_id = ${schema}.collections.id
  AND ${schema}.access.key_id = $1
  AND ${schema}.access.deleted_at IS NULL
`

const run = async (
  url: string,
  schema: string,
  key: string,
) => {
  const db = new Db(url)

  const k = (await db.run<{ id: number, comment: string }>(getKey(schema), [key]))[0]
  if (!k) {
    db.close()
    throw msg.doesNotExist('key', key)
  }

  const access = await db.run(getAccess(schema), [k.id])
  const res = {
    key,
    comment: k.comment,
    access,
  }

  db.close()
  console.log(JSON.stringify(res, null, 2))
}

export default run

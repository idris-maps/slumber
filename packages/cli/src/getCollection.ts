import Db from '@slumber/db'
import msg from './messages'

const getSchema = (schema: string) => `
  SELECT id, schema FROM ${schema}.collections
  WHERE name = $1
  AND deleted_at IS NULL
  LIMIT 1
`

const getAccess = (schema: string) => `
  SELECT
  ${schema}.keys.key,
  ${schema}.keys.comment,
  ${schema}.access.get,
  ${schema}.access.post,
  ${schema}.access.patch,
  ${schema}.access.put,
  ${schema}.access.delete
  FROM ${schema}.access, ${schema}.keys
  WHERE ${schema}.access.key_id = ${schema}.keys.id
  AND ${schema}.access.collection_id = $1
  AND ${schema}.access.deleted_at IS NULL
`

const getData = (schema: string) => `
  SELECT __id, data FROM ${schema}.items
  WHERE collection_id = $1
  AND deleted_at IS NULL
`

const run = async (
  url: string,
  schema: string,
  collection: string,
  wantsAccess?: boolean,
  wantsData?: boolean,
  wantsSchema?: boolean,
) => {
  const db = new Db(url)

  const col = (await db.run<{ id: number, schema: any }>(getSchema(schema), [collection]))[0]
  if (!col) {
    db.close()
    throw msg.doesNotExist('collection', collection)
  }

  const access = wantsAccess
    ? await db.run(getAccess(schema), [col.id])
    : undefined
  
  const data = wantsData || (!wantsAccess && !wantsSchema)
    ? await db.run<{__id: string, data: any}>(getData(schema), [col.id])
    : undefined
  
  const res = {
    collection,
    access,
    data: data ? data.map(({ __id, data }) => ({ ...data, __id })) : undefined,
    schema: wantsSchema ? col.schema : undefined,
  }

  db.close()
  console.log(JSON.stringify(res, null, 2))
}

export default run

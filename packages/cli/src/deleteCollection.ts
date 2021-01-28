import Db from '@slumber/db'
import msg from './messages'

const getNewName = (name: string) => `deleted_${new Date().getTime()}_${name}`

const getId = (schema: string) => `
  SELECT id FROM ${schema}.collections
  WHERE name = $1
  LIMIT 1
`

const deleteCollection = (schema: string) => `
  UPDATE ${schema}.collections
  SET
  name = $1,
  deleted_at = NOW()
  WHERE id = $2
`

const deleteAccess = (schema: string) => `
  UPDATE ${schema}.access
  SET deleted_at = NOW()
  WHERE collection_id = $1
`

const deleteItems = (schema: string) => `
  UPDATE ${schema}.items
  SET deleted_at = NOW()
  WHERE collection_id = $1
`
const run = async (url: string, schema: string, collection: string) => {
  const db = new Db(url)

  const col = (await db.run<{ id: number }>(getId(schema), [collection]))[0]
  if (!col || !col.id) {
    throw msg.doesNotExist('collection', collection)
  }

  await Promise.all([
    db.run(deleteCollection(schema), [getNewName(collection), col.id]),
    db.run(deleteAccess(schema), [col.id]),
    db.run(deleteItems(schema), [col.id])
  ])

  db.close()

  console.log(JSON.stringify({ deletedCollection: collection }, null, 2))
}

export default run

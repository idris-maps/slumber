import Db from '@slumber/db'
import msg from './messages'

const getId = (schema: string) => `
  SELECT id FROM ${schema}.keys
  WHERE key = $1
`
const deleteKey = (schema: string) => `
  UPDATE ${schema}.keys
  SET deleted_at = NOW()
  WHERE id = $1
`
const deleteAccess = (schema: string) => `
  UPDATE ${schema}.access
  SET deleted_at = NOW()
  WHERE key_id = $1
`

const run = async (url: string, schema: string, key: string) => {
  const db = new Db(url)

  const k = (await db.run<{ id: number }>(getId(schema), [key]))[0]
  if (!k || !k.id) {
    throw msg.doesNotExist('key', key)
  }

  await Promise.all([
    db.run(deleteKey(schema), [k.id]),
    db.run(deleteAccess(schema), [k.id]),
  ])

  db.close()

  console.log(JSON.stringify({ deletedKey: key }, null, 2))
}

export default run

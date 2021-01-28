import Db from '@slumber/db'
import msg from './messages'

const checkNameQuery = (schema: string) => `
  SELECT id FROM ${schema}.collections
  WHERE name = $1
  LIMIT 1
`

const insertQuery = (schema: string) => `
  INSERT INTO ${schema}.collections (
    name,
    schema
  )
  VALUES ($1, $2)
  RETURNING id
`

const run = async (
  dbUrl: string,
  dbSchema: string,
  name: string,
  jsonSchema: any,
) => {
  const db = new Db(dbUrl)
  
  const exists = (await db.run(checkNameQuery(dbSchema), [name]))[0]
  if (exists) {
    db.close()
    throw msg.colExists(name)
  }

  const id = (await db.run(insertQuery(dbSchema), [name, JSON.stringify(jsonSchema)]))[0]
  if (!id) {
    db.close()
    throw msg.unknownErr(`Could not create collection "${name}"`)
  }

  db.close()
  console.log(`Created collection "${name}"`)
}

export default run

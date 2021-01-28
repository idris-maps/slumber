import Db from '@slumber/db'
import msg from './messages'
import { v4 } from 'uuid'

const query = (schema: string) => `
  INSERT INTO ${schema}.keys (
    key,
    comment
  )
  VALUES ($1, $2)
  RETURNING id
`

const run = async (url: string, schema: string, comment?: string) => {
  const db = new Db(url)
  const key = v4()
  
  const id = (await db.run(query(schema), [key, comment]))[0]
  if (!id) {
    db.close()
    throw msg.unknownErr('Could not create key')
  }

  db.close()
  console.log(JSON.stringify({ key }, null, 2))
}

export default run

import Db from '@slumber/db'

const list = (schema: string) => `
  SELECT key, comment FROM ${schema}.keys
  WHERE deleted_at IS NULL
`

const run = async (url: string, schema: string) => {
  const db = new Db(url)

  const keys = (await db.run<{ key: string, comment: string }>(list(schema)))

  db.close()
  console.log(JSON.stringify({ keys }, null, 2))
}

export default run

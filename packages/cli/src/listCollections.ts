import Db from '@slumber/db'

const list = (schema: string) => `
  SELECT name FROM ${schema}.collections
  WHERE deleted_at IS NULL
`

const run = async (url: string, schema: string) => {
  const db = new Db(url)

  const collections = (await db.run<{ name: string }>(list(schema)))
    .map(d => d.name)
    .sort()

  db.close()
  console.log(JSON.stringify({ collections }, null, 2))
}

export default run

import Db from '@slumber/db'
import msg from './messages'

interface Methods {
  get: boolean
  post: boolean
  patch: boolean
  put: boolean
  delete: boolean
}

interface Access extends Methods {
  id: number
  collection_id: number
  key_id: number
}

const getColId = (schema: string) => `
  SELECT id FROM ${schema}.collections
  WHERE name = $1
  LIMIT 1
`

const getKeyId = (schema: string) => `
  SELECT id FROM ${schema}.keys
  WHERE key = $1
  LIMIT 1
`

const getAccess = (schema: string) => `
  SELECT * FROM ${schema}.access
  WHERE collection_id = $1
  AND key_id = $2
  LIMIT 1
`

const updateAccess = (schema: string) => `
  UPDATE ${schema}.access
  SET
  get = $1,
  post = $2,
  patch = $3,
  put = $4,
  delete = $5,
  updated_at = NOW()
  WHERE id = $6
`

const insertAccess = (schema: string) => `
  INSERT INTO ${schema}.access (
    collection_id,
    key_id,
    get,
    post,
    patch,
    put,
    delete
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
`

const run = async (
  url: string,
  schema: string,
  collection: string,
  key: string,
  methods: string[],
) => {
  const db = new Db(url)

  const col = (await db.run<{ id: string }>(getColId(schema), [collection]))[0]
  if (!col || !col.id) {
    db.close()
    throw msg.doesNotExist('collection', collection)
  }

  const k = (await db.run<{ id: string }>(getKeyId(schema), [key]))[0]
  if (!k || !k.id) {
    db.close()
    throw msg.doesNotExist('key', key)
  }

  const exists = (await db.run<Access>(getAccess(schema), [col.id, k.id]))[0]

  if (exists && exists.id) {
    await db.run(
      updateAccess(schema),
      [
        methods.includes('get'),
        methods.includes('post'),
        methods.includes('patch'),
        methods.includes('put'),
        methods.includes('delete'),
        exists.id,
      ],
    )

    db.close()

    console.log(JSON.stringify({
      access: 'updated',
      collection,
      key,
      methods,
    }, null, 2))

    return
  }

  await db.run(
    insertAccess(schema),
    [
      col.id,
      k.id,
      methods.includes('get'),
      methods.includes('post'),
      methods.includes('patch'),
      methods.includes('put'),
      methods.includes('delete'),
    ]
  )

  db.close()

  console.log(JSON.stringify({
    access: 'set',
    collection,
    key,
    methods,
  }, null, 2))
}

export default run

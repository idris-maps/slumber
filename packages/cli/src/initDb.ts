import Db from '@slumber/db'

const createSchema = (schema: string) => `
CREATE SCHEMA IF NOT EXISTS ${schema}
`

const createCollections = (schema: string) => `
CREATE TABLE IF NOT EXISTS ${schema}.collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  schema JSON NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
)
`

const uniqCollectionName= (schema: string) => `
CREATE INDEX IF NOT EXISTS ${schema}_uniq_collection_name ON ${schema}.collections (name);
`

const createItems = (schema: string) => `
CREATE TABLE IF NOT EXISTS ${schema}.items (
  id SERIAL PRIMARY KEY,
  __id UUID NOT NULL,
  collection_id INTEGER NOT NULL,
  data JSON DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  FOREIGN KEY(collection_id) REFERENCES ${schema}.collections(id)
)
`

const createKeys = (schema: string) => `
CREATE TABLE IF NOT EXISTS ${schema}.keys (
  id SERIAL PRIMARY KEY,
  key VARCHAR NOT NULL,
  comment VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
)
`

const uniqKey = (schema: string) => `
CREATE INDEX IF NOT EXISTS ${schema}_uniq_key ON ${schema}.keys (key);
`

const createAccess = (schema: string) => `
CREATE TABLE IF NOT EXISTS ${schema}.access (
  id SERIAL PRIMARY KEY,
  key_id INTEGER,
  collection_id INTEGER,
  get BOOLEAN,
  post BOOLEAN,
  patch BOOLEAN,
  put BOOLEAN,
  delete BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  FOREIGN KEY(key_id) REFERENCES ${schema}.keys (id),
  FOREIGN KEY(collection_id) REFERENCES ${schema}.collections (id)
)
`

const run = async(url: string, schema: string) => {
  const db = new Db(url)
  await db.run(createSchema(schema))
  await db.run(createCollections(schema))
  await db.run(uniqCollectionName(schema))
  await db.run(createItems(schema))
  await db.run(createKeys(schema))
  await db.run(createKeys(schema))
  await db.run(uniqKey(schema))
  await db.run(createAccess(schema))
  db.close()
  console.log('Created tables')
}

export default run

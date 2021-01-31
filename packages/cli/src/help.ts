const ops = `
  --USAGE--

  slumber <OPERATION> <ARGUMENTS>

  --OPERATIONS--

  * create-collection
  * create-key
  * delete-collection
  * delete-key
  * get-collection
  * get-key
  * init-db
  * list-collections
  * list-keys
  * set-access
  
  For more info about an operation:

  slumber help --op <OPERATION>

  or https://github.com/idris-maps/slumber/tree/master/packages/cli#slumbercli
`

const createCollection = `
  Create a data collection

  --ARGUMENTS--

  * name: the name of the collection
  * schema-file: path to a JSON file with the schema
  
  --EXAMPLE--

  slumber create-collection \
    --name my-collection \
    --schema-file my-schema.json
`

const createKey = `
  Create an API key

  --ARGUMENTS--

  * comment: (optional) description of what the key will be used for

  --EXAMPLE--

  slumber create-key \
    --comment "For my app"
`

const deleteCollection = `
  Delete a data collection

  --ARGUMENTS--

  * name: the name of the collection to delete

  --EXAMPLE--

  slumber delete-collection \
    --name my-collection
`

const deleteKey = `
  Delete an API key

  --ARGUMENTS--

  * key: the key to delete

  --EXAMPLE--

  slumber delete-key \
    --key 1234-the-api-key
`

const getCollection = `
  View a collection

  --ARGUMENTS--

  * name: the name of the collection
  * access: (optional) show keys that have access to the collection
  * schema: (optional) show the JSON schema
  * data: (optional) show the data in the collection

  --EXAMPLE--

  slumber get-collection \
    --name my-collection \
    --access \
    --schema \
    --data
`

const getKey = `
  Get an API key and the related accesses

  --ARGUMENTS--

  * key: the API key

  --EXAMPLE--

  slumber get-key \
    --key 1234-the-api-key
`

const initDb = `
  Initialize the database by creating the needed tables

  --USAGE--

  slumber init-db
`

const listCollections = `
  List all data collections

  --USAGE--

  slumber list-collections
`

const listKeys = `
  List all API keys

  --USAGE--

  slumber list-keys
`

const setAccess = `
  Give an API key access to a collection

  --ARGUMENTS--

  * collection: the name of the collection
  * key: the API key
  * methods: the allowed methods separated by commas

  --EXAMPLE--

  slumber set-access \
    --collection my-collection \
    --key 1234-the-api-key \
    --methods get,delete,patch,post,put
`

const getMsg = (op?: string) => {
  switch (op) {
    case 'create-collection': return createCollection
    case 'create-key': return createKey
    case 'delete-collection': return deleteCollection
    case 'delete-key': return deleteKey
    case 'get-collection': return getCollection
    case 'get-key': return getKey
    case 'init-db': return initDb
    case 'list-collections': return listCollections
    case 'list-keys': return listKeys
    case 'set-access': return setAccess
    default: return ops
  }
}

export default (op?: string) =>
  console.log(getMsg(op))


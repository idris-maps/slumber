# `@slumber/cli`

CLI for `slumber` database admin

## Install

```
npm install @slumber/cli
```

## Usage

```
slumber <OPERATION> <ARGUMENTS>
```

## Operations

### `create-collection`

Arguments

* `--name <STRING>` name of the collection (validation is `decodeURIComponent(name) === encodeURIComponent`)
* `--schema-file <STRING>` path to a file with the [JSON schema](https://json-schema.org/understanding-json-schema/) relative to where the command is executed

Example

```
slumber create-collection --name test_1 --schema-file schema.json
```

### `create-key`

Arguments

* `--comment <STRING>` (optional) to remember what is it is used for

Example

```
slumber create-key --comment "For my app"
```

returns 

```json
{
  "key": "4688f608-15b5-4784-841f-e6c3f81213c0"
}
```

### `delete-collection`

Arguments

* `--name <STRING>` the collection you want to delete

Example

```
slumber delete-collection --name test_1
```

returns

```json
{
  "deletedCollection": "test_1"
}
```

### `delete-key`

Arguments

* `--key <STRING>` the key you want to delete

Example

```
slumber delete-key --key 4688f608-15b5-4784-841f-e6c3f81213c0
```

returns

```json
{
  "deletedKey": "4688f608-15b5-4784-841f-e6c3f81213c0"
}
```

### `get-collection`

Arguments

* `--name <STRING>` the name of the collection
* `--access` (optional) to see the keys that have access to the collection
* `--data` (optional) to see the content of the collection
* `--schema` (optional) to see the JSON schema of the collection


Example

```
slumber get-collection --name test_1 --access --data --schema
```

returns

```json
{
  "collection": "test_1",
  "access": [
    {
      "key": "4688f608-15b5-4784-841f-e6c3f81213c0",
      "comment": "For my app",
      "get": true,
      "post": true,
      "patch": false,
      "put": false,
      "delete": false
    }
  ],
  "data": [
    {
      "test": "hello world"
    }
  ],
  "schema": {
    "type": "object",
    "properties": {
      "test": {
        "type": "string"
      }
    }
  }
}
```

### `get-key`

Arguments

* `--key <STRING>` the key you want to see

Example 

```
slumber get-key --key 4688f608-15b5-4784-841f-e6c3f81213c0
```

returns

```json
{
  "key": "4688f608-15b5-4784-841f-e6c3f81213c0",
  "comment": "For my app",
  "access": [
    {
      "collection": "test_1",
      "get": true,
      "post": true,
      "patch": false,
      "put": false,
      "delete": false
    }
  ]
}
```

### `init-db`

Create the database tables.

### `list-collections`

Example

```
slumber list-collections
```

returns

```
{
  "collections": [
    "test_1"
  ]
}
```

### `list-keys`

Example

```
slumber list-keys
```

returns

```json
{
  "keys": [
    {
      "key": "4688f608-15b5-4784-841f-e6c3f81213c0",
      "comment": "For my app"
    }
  ]
}
```

### `set-access`

Arguments

* `--key <STRING>` the key to which you want to give access to a collection
* `--collection <STRING>` the collection name
* `--methods <STRING>` the allowed methods, comma-separated, no spaces

This will override existing access for that key / collection pair. If the key can already do GET and you want to add POST `--methods` must be `get,post`.

Example

```
slumber set-access \
--key 4688f608-15b5-4784-841f-e6c3f81213c0 \
--collection test_1  \
--methods get,post
```

returns

```json
{
  "access": "set",
  "collection": "test_1",
  "key": "4688f608-15b5-4784-841f-e6c3f81213c0 ",
  "methods": [
    "get",
    "post"
  ]
}
```

If the key already had access to the collection `access` would have been `updated`.

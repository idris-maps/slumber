#!/usr/bin/env node
import msg from './messages'
import initDb from './initDb'
import createCollection from './createCollection'
import createKey from './createKey'
import getCollection from './getCollection'
import getKey from './getKey'
import listCollections from './listCollections'
import listKeys from './listKeys'
import deleteCollection from './deleteCollection'
import deleteKey from './deleteKey'
import setAccess from './setAccess'
import {
  getArg,
  getCollectionName,
  getEnvVar,
  getFile,
  getOptionalArg,
  getMethods,
} from './utils'

const operation = process.argv[2]

const run = async () => {
  if (!operation) {
    console.log(msg.noOp)
    return
  }

  if (operation === 'init-db') {
    return initDb(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
    )
  }

  if (operation === 'create-collection') {
    return createCollection(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getCollectionName(),
      getFile('schema-file'),
    )
  }

  if (operation === 'create-key') {
    return createKey(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getOptionalArg('comment'),
    )
  }

  if (operation === 'set-access') {
    return setAccess(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getArg('collection'),
      getArg('key'),
      getMethods(),
    )
  }

  if (operation === 'get-collection') {
    return getCollection(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getArg('name'),
      getOptionalArg('access'),
      getOptionalArg('data'),
      getOptionalArg('schema'),
    )
  }

  if (operation === 'get-key') {
    return getKey(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getArg('key'),
    )
  }

  if (operation === 'list-collections') {
    return listCollections(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
    )
  }

  if (operation === 'list-keys') {
    return listKeys(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
    )
  }

  if (operation === 'delete-collection') {
    return deleteCollection(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getArg('name'),
    )
  }

  if (operation === 'delete-key') {
    return deleteKey(
      getEnvVar('DATABASE_URL'),
      getEnvVar('DATABASE_SCHEMA'),
      getArg('key'),
    )
  }

  console.log(msg.noOp)
}

run().catch(err => {
  console.log(err)
  process.exit(1)
})

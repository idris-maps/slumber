import Db from '@slumber/db'
import { omit } from 'ramda'
import { v4 } from 'uuid'
import env from '../env'

export interface DataItem {
  __id: string
  [key: string]: any
}

const GET_ALL = `
  SELECT __id, data FROM ${env.dbSchema}.items
  WHERE collection_id = $1
  AND deleted_at IS NULL
`

const getAll = (db: Db) =>
  async (collectionId: number): Promise<DataItem[]> => {
    const r = await db.run<{ __id: number, data: any }>(GET_ALL, [collectionId])
    return r.map(({ __id, data }) => ({ ...data, __id }))
  }

const GET_ONE = `
  SELECT data FROM ${env.dbSchema}.items
  WHERE __id = $1
  AND collection_id = $2
  AND deleted_at IS NULL
`

const getOne = (db: Db) =>
  async (collectionId: number, __id: string): Promise<DataItem | undefined> => {
    const r = (await db.run<{ data: any }>(GET_ONE, [__id, collectionId]))[0]
    return r?.data ? { ...r.data, __id } : undefined
  }

const POST = `
  INSERT INTO ${env.dbSchema}.items (
    __id,
    collection_id,
    data
  )
  VALUES ($1, $2, $3)
`

const post = (db: Db) =>
  async (collection_id: number, data: any): Promise<DataItem> => {
    const __id = v4()
    await db.run(POST, [__id, collection_id, data])
    return { ...data, __id }
  }

const UPDATE = `
  UPDATE ${env.dbSchema}.items
  SET data = $1
  WHERE __id = $2
`

const patch = (db: Db) =>
  async (collectionId: number, __id: string, data: any): Promise<DataItem | undefined> => {
    const prev = await getOne(db)(collectionId, __id)
    if (!prev) { return undefined }
    const next = omit(['__id'], { ...prev, ...data })
    await db.run(UPDATE, [next, __id])
    return { ...next, __id }
  }

const put = (db: Db) =>
  async (collectionId: number, __id: string, data: any): Promise<DataItem | undefined> => {
    const prev = await getOne(db)(collectionId, __id)
    if (!prev) { return undefined }
    await db.run(UPDATE, [data, __id])
    return { ...data, __id }
  }

const DELETE = `
  UPDATE ${env.dbSchema}.items
  SET deleted_at = NOW()
  WHERE __id = $1
`

const _delete = (db: Db) =>
  async (collectionId: number,__id: string): Promise<boolean> => {
    const item = await getOne(db)(collectionId, __id)
    if (!item) { return false }
    await db.run(DELETE, [__id])
    return true
  }

export default {
  getAll,
  getOne,
  post,
  patch,
  put,
  'delete': _delete,
}
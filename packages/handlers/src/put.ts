import Db from '@slumber/db'
import { validate as isUuid } from 'uuid'
import req from './db'
import validate from './validate'
import response from './response'
import { HandlerResponse } from './types'

export default (db: Db, closeDb?: boolean) =>
  async (collection: string, __id: string, key: string, data: any): Promise<HandlerResponse> => {
    const getCollection = req.collections.get(db)
    const getAllowedMethods = req.access.getAllowedMethods(db)
    const putItem = req.items.put(db)
    const respond = response(db, closeDb)

    if (!isUuid(__id)) {
      return respond({ status: 404 })
    }

    const col = await getCollection(collection)
    if (!col) { return respond({ status: 404 }) }

    const allowedMethods = await getAllowedMethods(col.id, key)
    if (allowedMethods.length === 0) { return respond({ status: 404 }) }
    if (!allowedMethods.includes('put')) { return respond({ status: 403 }) }

    const check = validate(col.schema, data)
    if (!check.valid && check.error) { return respond({ status: 400, data: { error: check.error } }) }

    const item = await putItem(col.id, __id, data)
    return item
      ? respond({ status: 200, data: item })
      : respond({ status: 404 })
  }

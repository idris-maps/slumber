import Db from '@slumber/db'
import req from './db'
import validate from './validate'
import response from './response'
import { HandlerResponse } from './types'

export default (db: Db, closeDb?: boolean) =>
  async (collection: string, key: string, data: any): Promise<HandlerResponse> => {
    const getCollection = req.collections.get(db)
    const getAllowedMethods = req.access.getAllowedMethods(db)
    const createItem = req.items.post(db)
    const respond = response(db, closeDb)

    const col = await getCollection(collection)
    if (!col) { return respond({ status: 404 }) }

    const allowedMethods = await getAllowedMethods(col.id, key)
    if (allowedMethods.length === 0) { return respond({ status: 404 }) }
    if (!allowedMethods.includes('post')) { return respond({ status: 403 }) }

    const check = validate(col.schema, data)
    if (!check.valid && check.error) { return respond({ status: 400, data: { error: check.error } }) }

    const item = await createItem(col.id, data)
    return respond({ status: 200, data: item })
  }

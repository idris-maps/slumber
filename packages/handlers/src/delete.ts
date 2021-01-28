import Db from '@slumber/db'
import { validate as isUuid } from 'uuid'
import req from './db'
import response from './response'
import { HandlerResponse } from './types'

export default (db: Db, closeDb?: boolean) =>
  async (collection: string, __id: string, key: string): Promise<HandlerResponse> => {
    const getCollectionId = req.collections.getId(db)
    const getAllowedMethods = req.access.getAllowedMethods(db)
    const deleteItem = req.items.delete(db)
    const respond = response(db, closeDb)

    if (!isUuid(__id)) {
      return respond({ status: 404 })
    }

    const collectionId = await getCollectionId(collection)
    if (!collectionId) { return respond({ status: 404 }) }

    const allowedMethods = await getAllowedMethods(collectionId, key)
    if (allowedMethods.length === 0) { return respond({ status: 404 }) }
    if (!allowedMethods.includes('delete')) { return respond({ status: 403 }) }

    const item = await deleteItem(collectionId, __id)
    return respond({ status: item ? 204 : 404 })
  }

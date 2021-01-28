import Db from '@slumber/db'
import req from './db'
import response from './response'
import { HandlerResponse } from './types'

export default (db: Db, closeDb?: boolean) =>
  async (collection: string, key: string): Promise<HandlerResponse> => {
    const getCollectionId = req.collections.getId(db)
    const getAllowedMethods = req.access.getAllowedMethods(db)
    const getItems = req.items.getAll(db)
    const respond = response(db, closeDb)

    const collectionId = await getCollectionId(collection)
    if (!collectionId) { return respond({ status: 404 }) }

    const allowedMethods = await getAllowedMethods(collectionId, key)
    if (allowedMethods.length === 0) { return respond({ status: 404 }) }
    if (!allowedMethods.includes('get')) { return respond({ status: 403 }) }

    const data = await getItems(collectionId)
    return respond({ status: 200, data })
  }

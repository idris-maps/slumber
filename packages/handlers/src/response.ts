import Db from '@slumber/db'
import { HandlerResponse } from './types'

export default (db: Db, closeDb: boolean = false) =>
  (res: HandlerResponse) => {
    if (closeDb) { db.close() }
    return res
  }

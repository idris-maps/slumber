import Db from '@slumber/db'
import getAll from './getAll'
import getOne from './getOne'
import post from './post'
import patch from './patch'
import put from './put'
import _delete from './delete'
import env from './env'

export default (closeDbBeforeResponse?: boolean) => {
  const db = new Db(env.dbUrl)

  return {
    getAll: getAll(db, closeDbBeforeResponse),
    getOne: getOne(db, closeDbBeforeResponse),
    post: post(db, closeDbBeforeResponse),
    patch: patch(db, closeDbBeforeResponse),
    put: put(db, closeDbBeforeResponse),
    delete: _delete(db, closeDbBeforeResponse),
  }
}

import test from 'ava'
import { omit, path } from 'ramda'
import Db from '@slumber/db'
import { v4 } from 'uuid'
import env from '../src/env'
import _post from '../src/post'
import _getAll from '../src/getAll'
import _getOne from '../src/getOne'
import _patch from '../src/patch'
import _put from '../src/put'
import _delete from '../src/delete'
import { prepare } from './helpers'


test('handlers', async t => {
  const { collection, key, data } = await prepare()
  const db = new Db(env.dbUrl)
  const post = _post(db)
  const getAll = _getAll(db)
  const getOne = _getOne(db)
  const patch = _patch(db)
  const put = _put(db)
  const del = _delete(db)

  // post

  const postSuccess = await post(collection, key.allowedAll, data.valid)
  const __id = path<string>(['data', '__id'], postSuccess)
  if (!__id) {
    throw 'post did not return __id'
  }
  t.is(postSuccess.status, 200)

  const postNotCollection = await post('not-a-collection', key.allowedAll, data.valid)
  t.is(postNotCollection.status, 404)

  const postNotKey = await post(collection, 'not-a-key', data.valid)
  t.is(postNotKey.status, 404)

  const postUnAuth = await post(collection, key.onlyGet, data.valid)
  t.is(postUnAuth.status, 403)

  const postInvalid = await post(collection, key.allowedAll, data.invalid)
  t.is(postInvalid.status, 400)

  // getAll

  const getAllSuccess = await getAll(collection, key.allowedAll)
  t.is(getAllSuccess.status, 200)
  t.true((getAllSuccess.data || []).map(d => d.__id).includes(postSuccess.data.__id))

  const getAllNoCollection = await getAll('not-a-collection', key.allowedAll)
  t.is(getAllNoCollection.status, 404)

  const getAllNoKey = await getAll(collection, 'not-a-key')
  t.is(getAllNoKey.status, 404)

  const getAllNoAuth = await getAll(collection, key.onlyPost)
  t.is(getAllNoAuth.status, 403)

  // getOne

  const getOneSuccess = await getOne(collection, __id, key.allowedAll)
  t.is(getOneSuccess.status, 200)
  t.deepEqual(omit(['__id'], path(['data'], getOneSuccess)), data.valid)

  const getOneNoCollection = await getOne('not-a-collection', __id, key.allowedAll)
  t.is(getOneNoCollection.status, 404)

  const getOneNoKey = await getOne(collection, __id, 'not-a-key')
  t.is(getOneNoKey.status, 404)

  const getOneNoAuth = await getOne(collection, __id, key.onlyPost)
  t.is(getOneNoAuth.status, 403)

  const getOneInvalidId = await getOne(collection, 'not-an-id', key.allowedAll)
  t.is(getOneInvalidId.status, 404)

  const getOneNoId = await getOne(collection, v4(), key.allowedAll)
  t.is(getOneNoId.status, 404)

  // patch

  const patchSuccess = await patch(collection, __id, key.allowedAll, { test_number: 1 })
  t.is(patchSuccess.status, 200)
  t.is(path(['data', 'test_number'], patchSuccess), 1)

  const patchInvalid = await patch(collection, __id, key.allowedAll, data.invalid)
  t.is(patchInvalid.status, 400)

  const patchNoCollection = await patch('not-a-collection', __id, key.allowedAll, { test_number: 1 })
  t.is(patchNoCollection.status, 404)

  const patchInvalidId = await patch(collection, 'not-an-id', key.allowedAll, { test_number: 1 })
  t.is(patchInvalidId.status, 404)

  const patchNoId = await patch(collection, v4(), key.allowedAll, { test_number: 1 })
  t.is(patchNoId.status, 404)

  const patchNoKey = await patch(collection, __id, 'not-a-key', { test_number: 1 })
  t.is(patchNoKey.status, 404)

  const patchNoAuth = await patch(collection, __id, key.onlyGet, { test_number: 1 })
  t.is(patchNoAuth.status, 403)

  // put

  const putSuccess = await patch(collection, __id, key.allowedAll, { test_number: 3, test_string: 'a' })
  t.is(putSuccess.status, 200)
  t.is(path(['data', 'test_number'], putSuccess), 3)
  t.is(path(['data', 'test_string'], putSuccess), 'a')

  const putIncomplete = await put(collection, __id, key.allowedAll, { test_number: 3 })
  t.is(putIncomplete.status, 400)

  const putInvalid = await put(collection, __id, key.allowedAll, data.invalid)
  t.is(putInvalid.status, 400)

  const putNoCollection = await put('not-a-collection', __id, key.allowedAll, data.valid)
  t.is(putNoCollection.status, 404)

  const putInvalidId = await put(collection, 'not-an-id', key.allowedAll, data.valid)
  t.is(putInvalidId.status, 404)

  const putNoId = await put(collection, v4(), key.allowedAll, data.valid)
  t.is(putNoId.status, 404)

  const putNoKey = await put(collection, __id, 'not-a-key', data.valid)
  t.is(putNoKey.status, 404)

  const putNoAuth = await put(collection, __id, key.onlyGet, data.valid)
  t.is(putNoAuth.status, 403)

  // delete

  const deleteNoCollection = await del('not-a-collection', __id, key.allowedAll)
  t.is(deleteNoCollection.status, 404)

  const deleteInvalidId = await del(collection, 'not-an-id', key.allowedAll)
  t.is(deleteInvalidId.status, 404)

  const deleteNoId = await del(collection, v4(), key.allowedAll)
  t.is(deleteNoId.status, 404)

  const deleteNoKey = await del(collection, __id, 'not-a-key')
  t.is(deleteNoKey.status, 404)

  const deleteNoAuth = await del(collection, __id, key.onlyGet)
  t.is(deleteNoAuth.status, 403)

  const deleteSuccess = await del(collection, __id, key.allowedAll)
  t.is(deleteSuccess.status, 204)
  t.is((await getOne(collection, __id, key.allowedAll)).status, 404)
})

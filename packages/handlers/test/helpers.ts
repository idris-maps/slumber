import { exec } from 'child_process'
import { v4 } from 'uuid'

export const cmd = <T = void>(d: string, asJson: boolean = false): Promise<T | void> =>
  new Promise((resolve, reject) =>
    exec(d, (err, stdout, stderr) => {
      if (err) { return reject(err) }
      if (stderr) {
        return reject(stderr)
      }
      if (stdout && asJson) {
        try {
          return resolve(JSON.parse(stdout))
        } catch (e) {
          return reject(stdout)
        }
      } else {
        console.log(stdout)
      }
      return resolve()
    })
  )

const getKey = async (collection: string, methods: string) => {
  const k = await cmd<{ key: string }>(`npx slumber create-key`, true)
  if (k && k.key) {
    await cmd([
      `npx slumber set-access`,
      `--collection ${collection}`,
      `--key ${k.key}`,
      `--methods ${methods}`,
    ].join(' '), true)
    return k.key
  }
  throw new Error('Could not create key')
}

export const prepare = async () => {
  const collection = `test_${v4()}`
  await cmd(`npx slumber create-collection --name ${collection} --schema-file test/schema.json`)
  return {
    collection,
    key: {
      allowedAll: await getKey(collection, 'get,post,patch,put,delete'),
      onlyGet: await getKey(collection, 'get'),
      onlyPost: await getKey(collection, 'post'),
    },
    data: {
      valid: { test_string: 'hello', test_number: 2 },
      invalid: { test_string: 1, test_number: 'hello' },
    }
  }
}

import { readFileSync } from 'fs'
import { resolve } from 'path'
import Ajv from 'ajv'
const minimist = require('minimist')
import { config } from 'dotenv'
import msg from './messages'

config()

const argv = minimist(process.argv.slice(3))

export const getEnvVar = (d: string) => {
  const v = process.env[d]
  if (!v) { throw msg.noEnvVar(d) }
  return v
}

export const getArg = (d: string): string => {
  const v = argv[d]
  if (!v) { throw msg.noArg(d) }
  return String(v)
}

export const getOptionalArg = (d: string) => argv[d]

export const getCollectionName = () => {
  const name = getArg('name')
  if (encodeURIComponent(name) !== decodeURIComponent(name)) {
    throw msg.invalidArg('name', name)
  }
  return name
}

export const allowedMethods = [
  'get',
  'post',
  'patch',
  'put',
  'delete',
]

export const getMethods = () => {
  const arg = getArg('methods')
  const values = arg.split(',')
    .map(d => d.trim().toLowerCase())

  if (values.length === 0 || !values.every(d => allowedMethods.includes(d))) {
    throw msg.invalidArg('methods', arg)
  }
  return values
}

const parseJson = (fileName: string, file: string) =>  {
  try {
    return JSON.parse(file)
  } catch (err) {
    throw msg.notJsonFile(fileName)
  }
}

const validateSchema = (fileName: string, schema: any) => {
  const ajv = new Ajv()
  const valid = ajv.validateSchema(schema)
  if (!valid) {
    throw msg.noJsonSchema(fileName, ajv.errorsText())
  }
  return true
}

export const getFile = (argKey: string) => {
  const fileName = getArg(argKey)
  const path = resolve(fileName)
  try {
    const file = readFileSync(path, 'utf-8')
    const json = parseJson(fileName, file)
    validateSchema(fileName, json)
    return json
  } catch (err) {
    throw err
  }
}

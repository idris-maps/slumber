const noOp = `
  Unknown operation

  List all operations:

  slumber help
`
const missingVar = (d: string) => `
  The environment variable ${d} is not defined
`
const missingArg = (d: string) => `
  The argument "${d}" is missing.
  Add "--${d} <VALUE>"
`
const invalidArg = (key: string, value: any) => `
  "${value}" is not a valid value for "${key}"
`
const isNotJsonFile = (d: string) => `
  "${d}" is not a JSON file
`
const collectionExists = (d: string) => `
  Collection "${d}" already exists
`
const invalidJsonSchema = (file: string, errors: string) => `
  "${file}" is not a valid JSON schema

  ${errors}
`
const doesNotExist = (key: string, value: string) => `
  ${key} "${value}" does not exists
` 
const unknownErr = (d: string) => `
  Unknown error: ${d}
`
const error = (reason: string) => `
ERROR
${reason}
`

export default {
  noOp: error(noOp),
  noEnvVar: (d: string) =>  error(missingVar(d)),
  noArg: (d: string) => error(missingArg(d)),
  invalidArg: (key: string, value: any) => error(invalidArg(key, value)),
  notJsonFile: (d: string) => error(isNotJsonFile(d)),
  noJsonSchema: (file: string, errors: string) => error(invalidJsonSchema(file, errors)),
  colExists: (d: string) => error(collectionExists(d)),
  unknownErr,
  doesNotExist: (key: string, value: any) => error(doesNotExist(key, value)),
}

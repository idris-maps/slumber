import Ajv from 'ajv'

interface Validation {
  valid: boolean
  error?: string
}

export default (schema: any, data: any): Validation => {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, data)
  if (valid) { return { valid } }
  return { valid, error: ajv.errorsText() }
}

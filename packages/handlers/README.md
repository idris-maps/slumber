# `@slumber/handlers`

Handlers for `slumber`

## Install

```
npm install @slumber/handlers
```

## Usage

```ts
import handlers from '@slumber/handlers'

const {
  getAll,
  getOne,
  post,
  patch,
  put,
  delete,
} = handlers()
```

The `handlers` takes one optional argument `closeDbBeforeResponse?: boolean`. Set it to `true` when you want to close the database connection pool before returning the response. Can be useful for serverless functions.

### Handlers

All handlers return a `Promise<HandlerResponse>`

```ts
export interface HandlerResponse {
  status: number // HTTP status code
  data?: any // JSON response body
}
```

#### Arguments

* getAll
  - collection: string
  - key: string
* getOne
  - collection: string
  - __id: string
  - key: string
* post
  - collection: string
  - key: string
  - data: any
* patch
  - collection: string
  - __id: string
  - key: string
  - data: any
* put
  - collection: string
  - __id: string
  - key: string
  - data: any
* delete
  - collection: string
  - __id: string
  - key: string

`collection` is the name of the collection created with `@slumber/cli`
`key` is the API key created with `@slumber/cli`
`__id` is returned when an item is created with `post`
`data` is the item data as defined when creating the collection

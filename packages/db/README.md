# `@slumber/db`

The postgres connector for `slumber`.

## Usage

```ts
import Db from '@slumber/db'

const db = Db(process.env.DATABASE_URL)
```

## Methods

* `open: () => void`
* `close: () => void`
* `run: <T>(queryString: string, values?: any[]) => Promise<T[]>`

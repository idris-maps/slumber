import { Pool } from 'pg'

class Db {
  private connectionString: string
  private pool?: Pool

  constructor (databaseUrl: string) {
    this.connectionString = databaseUrl
  }

  public open = () => {
    if (!this.pool) {
      this.pool = new Pool({ connectionString: this.connectionString })
    }   
  }

  public close = () => {
    if (this.pool) {
      this.pool.end()
      this.pool = undefined
    }
  }

  public run = async <T>(queryString: string, values: any[] = []): Promise<T[]> => {
    try {
      this.open()
      if (this.pool) {
        const r = await this.pool.query<T>(queryString, values)
        return r.rows
      } else {
        throw new Error('Could not open pool')
      }
    } catch (err) {
      throw err
    }
  }
}

export default Db

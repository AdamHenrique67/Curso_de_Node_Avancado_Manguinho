import { ConnectionNotFoundError } from '@/infra/repos/postgres/helpers'

import { createConnection, getConnectionManager, getConnection, QueryRunner } from 'typeorm'

export class PgConnection {
  private static instance?: PgConnection
  private query?: QueryRunner

  private constructor () {}

  static getInstance (): PgConnection {
    if (!PgConnection.instance) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    const connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
    this.query = connection.createQueryRunner()
  }

  async disconnect (): Promise<void> {
    if (!this.query) {
      throw new ConnectionNotFoundError()
    }
    await getConnection().close()
    this.query = undefined
  }
}

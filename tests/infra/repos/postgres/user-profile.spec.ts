import { Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

import { PgUser } from '@/infra/repos/postgres/entities'
import { PgRepository, PgUserProfileRepository } from '@/infra/repos/postgres'
import { makeFakeDB } from '@/tests/infra/repos/postgres/mocks'
import { PgConnection } from '@/infra/repos/postgres/helpers'

describe('PgUserAccountRepository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>
  let connection: PgConnection
  let backup: IBackup

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDB([PgUser])
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserProfileRepository()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  test('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('savePicture', () => {
    test('should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url' })
      const PgUser = await pgUserRepo.findOne({ id })

      expect(PgUser).toMatchObject({ id, pictureUrl: 'any_url', initials: null })
    })
  })

  describe('load', () => {
    test('should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBe('any_name')
    })

    test('should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBeUndefined()
    })

    test('should returns undefined', async () => {
      const userProfile = await sut.load({ id: '1' })

      expect(userProfile).toBeUndefined()
    })
  })
})

import request from 'supertest'
import { app } from '@/main/config/app'
import { IBackup } from 'pg-mem'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'
import { PgUser } from '@/infra/repos/postgres/entities'
import { Repository } from 'typeorm'
import { env } from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import { PgConnection } from '@/infra/repos/postgres/helpers'

describe('User routes', () => {
  let backup: IBackup
  let pgUserRepo: Repository<PgUser>
  let connection: PgConnection

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDB([PgUser])
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
  })

  afterAll(async () => {
    await connection.disconnect()
  })
    
  describe('DELETE /users/picture', () => {
    test('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })

    test('should return 200 with valid data', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Adam henrique' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'AH' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()

    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({
        upload: uploadSpy
      })
    }))

    test('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })

    test('should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')

      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Adam henrique' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})

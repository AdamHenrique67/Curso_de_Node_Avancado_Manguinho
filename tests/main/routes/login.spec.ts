import request from 'supertest'
import { app } from '@/main/config/app'
import { IBackup } from 'pg-mem'
import { makeFakeDB } from '@/../tests/infra/repos/postgres/mocks'
import { PgUser } from '@/infra/repos/postgres/entities'
import { getConnection } from 'typeorm'
import { UnauthorizedError } from '@/application/errors'

describe('Login routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup

    const loadUserSpy = jest.fn()
    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    beforeAll(async () => {
      const db = await makeFakeDB([PgUser])
      backup = db.backup()
    })

    beforeEach(() => {
      backup.restore()
    })

    afterAll(async () => {
      await getConnection().close()
    })

    test('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })
      const { statusCode, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(statusCode).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    test('should return 401 with UnauthorizedError', async () => {
      const { statusCode, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(statusCode).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})

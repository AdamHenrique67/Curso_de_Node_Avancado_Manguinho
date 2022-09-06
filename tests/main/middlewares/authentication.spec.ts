import { app } from '@/main/config/app'

import request from 'supertest'
import { auth } from '@/main/middlewares'
import { ForbiddenError } from '@/application/errors'

describe('Authentication Middleware', () => {
  test('should return 403 with authorization header was not provided', async () => {
    app.get('/fake_route', auth)

    const { status, body } = await request(app).get('/fake_route')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })
})

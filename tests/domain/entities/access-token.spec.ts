import { AccessToken } from '@/domain/entities/access-token'

describe('AccessToken', () => {
  test('should expire in 1800000 minutes', () => {
    expect(AccessToken.expirationInMS).toBe(1800000)
  })
})

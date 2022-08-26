import { TokenValidator } from '@/domain/contracts/crypto'
import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookAuthentication', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_value')
    token = 'any_token'
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  test('should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  test('should call TokenValidator with correct params', async () => {
    const userId = await sut({ token })

    expect(userId).toBe(userId)
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})

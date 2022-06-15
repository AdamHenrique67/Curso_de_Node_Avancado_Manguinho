import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let sut: FacebookApi
  let axiosClient: AxiosHttpClient

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret)
  })

  test('should return Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: 'EAAKnVYgNm38BAN1r87Mqw0ZBxOc2U5xjiGg21HKgbU7UnXZAIRavlZAIkAKBTEdr5ZCgjhJvT0fpC821wORhoQJWj8CD5BKdkwAkRFfXeZA7Xh1E6M5o29wXMZCih4Fso5QHTyCDfZBYSizwFtOtXac89v7KlZBMkJTVv3u7XQlZC8kZCQWUwXhqpxdU5RZAtHvdVlXbVEbZBfEajwZDZD' })

    expect(fbUser).toEqual({
      facebookId: '102450535845532',
      name: 'Mango Teste',
      email: 'mango_apajrnb_teste@tfbnw.net'
    })
  })

  test('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})

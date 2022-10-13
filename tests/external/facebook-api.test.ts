import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
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
    const fbUser = await sut.loadUser({ token: 'EAAKnVYgNm38BAD9mBGqGdaoNo4vxzhg7NNFDjA20epZCYNbl8maB20sNvnzMm9yX8uumgj2QBUsgfLkyKOs7Kd3M5bmiQymu8Pkiq8y0qlLScdXE9ubHZBWKbMrm42AA47dnZCT9AIugun94BxaKfgcoBVUEvutv1TlAN7cM5SwIMUZBXsczxjjMLfyNiljuxo92gPP3y4OEiPSA6sts' })

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

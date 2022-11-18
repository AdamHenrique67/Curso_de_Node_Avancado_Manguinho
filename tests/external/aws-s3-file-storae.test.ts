import { AwsS3FileStorage } from '@/infra/gateways'
import { env } from '@/main/config/env'
import axios from 'axios'

describe('Aws S3 Integration Tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(
      env.s3.accessKey,
      env.s3.secret,
      env.s3.bucket)
  })

  test('should upload and delete image from aws s3', async () => {
    const onePixelImae = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFAAH/F1FwBgAAAABJRU5ErkJggg=='
    const file = Buffer.from(onePixelImae, 'base64')
    const key = 'any_key.png'

    const pictureUrl = await sut.upload({ key, file })

    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete({ key })

    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})

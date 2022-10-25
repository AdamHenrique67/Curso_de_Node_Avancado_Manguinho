import { config } from 'aws-sdk'

jest.mock('aws-sdk')

class AwsS3FileStorage {
  constructor (
    private readonly accessKey: string,
    private readonly secret: string
  ) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }
}

describe('AwsS3FileStorage', () => {
  test('should config aws credentials on creation', () => {
    const accessKey = 'ant_access_key'
    const secret = 'any_secret'

    const sut = new AwsS3FileStorage(accessKey, secret)

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenLastCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})

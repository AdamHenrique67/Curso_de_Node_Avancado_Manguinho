import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = { file: any }
type Model = Error

class SavePictureController {
  async perform ({ file }: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'))
  }
}

describe('SavePictureController', () => {
  let sut: SavePictureController

  beforeEach(() => {
    sut = new SavePictureController()
  })

  test('should return 400 if file not provided', async () => {
    const httpResponse = await sut.perform({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file not provided', async () => {
    const httpResponse = await sut.perform({ file: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.perform({ file: { buffer: Buffer.from('') } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})

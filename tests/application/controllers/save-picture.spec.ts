import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer, mimeType: string } }
type Model = Error

class SavePictureController {
  async perform ({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (!file || file.buffer.length === 0) {
      return badRequest(new RequiredFieldError('file'))
    }
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    }
    if (file.buffer.length > 5 * 1024 * 1024) {
      return badRequest(new MaxFileSizeError(5))
    }
  }
}

class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsopported type. Allowed types:${allowed.join(', ')}`)
    this.name = 'InvalidMymeTypeError'
  }
}

class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  let sut: SavePictureController

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
  })

  beforeEach(() => {
    sut = new SavePictureController()
  })

  test('should return 400 if file not provided', async () => {
    const httpResponse = await sut.perform({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file not provided', async () => {
    const httpResponse = await sut.perform({ file: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.perform({ file: { buffer: Buffer.from(''), mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'invalid_type' } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/png' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpeg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file size is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.perform({ file: { buffer: invalidBuffer, mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })
})

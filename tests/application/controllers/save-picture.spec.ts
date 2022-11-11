import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse, ok } from '@/application/helpers'
import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string}

class SavePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}
  async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!file || file.buffer.length === 0) {
      return badRequest(new RequiredFieldError('file'))
    }
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
    }
    if (file.buffer.length > 5 * 1024 * 1024) {
      return badRequest(new MaxFileSizeError(5))
    }
    const result = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(result)
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
  let file: { buffer: Buffer, mimeType: string }
  let sut: SavePictureController
  let userId: string
  let changeProfilePicture: jest.Mock

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    userId = 'any_user_id'
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_initials' })
  })

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  test('should return 400 if file not provided', async () => {
    const httpResponse = await sut.perform({ file: undefined as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file not provided', async () => {
    const httpResponse = await sut.perform({ file: null as any, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file is empty', async () => {
    const httpResponse = await sut.perform({ file: { buffer: Buffer.from(''), mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  test('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'invalid_type' }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/png' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpg' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpeg' }, userId })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  test('should not return 400 if file size is bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.perform({ file: { buffer: invalidBuffer, mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })

  test('should call ChangeProfilePicture with correct input', async () => {
    await sut.perform({ file, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  test('ChangeProfilePicture return data on sucess', async () => {
    const httpResponse = await sut.perform({ file, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_initials' }
    })
  })
})

import { Controller, SavePictureController } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

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

  test('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('should build Validators Correctly', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
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

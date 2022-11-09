import { Controller, DeletePictureController } from '@/application/controllers'

describe('DeletePictureController', () => {
  let changeProfilePicture: jest.Mock
  let sut: DeletePictureController

  beforeAll(() => {
    changeProfilePicture = jest.fn() // jest.fn() pois agora os useCases sao funções
  })

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture)
  })

  test('should call ChangeProfilePicture with correct input', async () => {
    await sut.perform({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  test('should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })

  test('should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})

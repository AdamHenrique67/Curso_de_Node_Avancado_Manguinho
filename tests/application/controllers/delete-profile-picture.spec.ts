import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, noContent } from '@/application/helpers'

type HttpRequest = { userId: string }

class DeletePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId })
    return noContent()
  }
}

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
    await sut.handle({ userId: 'any_user_id' })

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
})

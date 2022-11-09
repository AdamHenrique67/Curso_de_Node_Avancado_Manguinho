import { ChangeProfilePicture } from '@/domain/use-cases'

type HttpRequest = { userId: string }

class DeletePictureController {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ id: userId })
  }
}

describe('DeletePictureController', () => {
  test('should call ChangeProfilePicture with correct inout', async () => {
    const changeProfilePicture = jest.fn() // jest.fn() pois agora os useCases sao funções
    const sut = new DeletePictureController(changeProfilePicture)

    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})

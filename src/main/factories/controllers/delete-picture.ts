import { DeletePictureController } from '@/application/controllers'
import { makeCangeProfilePicture } from '@/main/factories/use-cases'

export const makeDeletePictureController = (): DeletePictureController => {
  return new DeletePictureController(makeCangeProfilePicture())
}

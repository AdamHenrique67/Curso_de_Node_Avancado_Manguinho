import { SavePictureController } from '@/application/controllers'
import { makeCangeProfilePicture } from '@/main/factories/use-cases'

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeCangeProfilePicture())
}

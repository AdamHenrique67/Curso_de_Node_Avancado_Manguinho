import { Controller, SavePictureController } from '@/application/controllers'
import { makeCangeProfilePicture } from '@/main/factories/use-cases'
import { makePgTransactionController } from '../decorators'

export const makeSavePictureController = (): Controller => {
  const controller = new SavePictureController(makeCangeProfilePicture())
  return makePgTransactionController(controller)
}

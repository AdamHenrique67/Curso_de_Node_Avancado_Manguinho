import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makeUniqueId } from '../gateways'
import { makePgUserProfileRepo } from '@/main/factories/repos/postgress'

export const makeCangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makeAwsS3FileStorage(),
    makeUniqueId(),
    makePgUserProfileRepo()
  )
}

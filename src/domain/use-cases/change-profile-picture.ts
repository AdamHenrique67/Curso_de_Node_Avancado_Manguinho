import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  let pictureUrl: string |undefined
  if (file) {
    const uuid = crypto.generateUuid({ key: id })
    pictureUrl = await fileStorage.upload({ file, key: uuid })
  } else {
    await userProfileRepo.load({ id })
  }
  await userProfileRepo.savePicture({ pictureUrl })
}

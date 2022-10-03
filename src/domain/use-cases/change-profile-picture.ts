import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { SaveUserPicture } from '@/domain/contracts/repos'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  if (file) {
    const uuid = crypto.generateUuid({ key: id })
    const pictureUrl = await fileStorage.upload({ file, key: uuid })
    await userProfileRepo.savePicture({ pictureUrl })
  }
}

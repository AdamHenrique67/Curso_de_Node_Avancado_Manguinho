import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  if (file) {
    const uuid = crypto.generateUuid({ key: id })
    await fileStorage.upload({ file, key: uuid })
  }
}

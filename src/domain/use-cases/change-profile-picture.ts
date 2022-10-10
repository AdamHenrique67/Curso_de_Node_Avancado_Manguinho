import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { id: string, file?: Buffer }
type Output = { id?: string, file?: string}
export type ChangeProfilePicture = (input: Input) => Promise<Output>
type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  const key = crypto.generateUuid({ key: id })
  const data = { 
    pictureUrl: file ? await fileStorage.upload({ file, key }) : undefined,
    name: !file ? (await userProfileRepo.load({ id })).name : undefined
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)
  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) await fileStorage.delete({ key })
    throw error
  }
  return userProfile  
}

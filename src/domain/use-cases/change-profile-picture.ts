import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'

type Input = { id: string, file?: { buffer: Buffer, mimeType: string } }
type Output = { initials?: string, pictureUrl?: string}
export type ChangeProfilePicture = (input: Input) => Promise<Output>
type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  const key = crypto.uuid({ key: id })
  const data = { 
    pictureUrl: file ? await fileStorage.upload({ file: file.buffer, fileName: `${key}.${file.mimeType.split('/')[1]}` }) : undefined,
    name: !file ? (await userProfileRepo.load({ id }))?.name : undefined
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)
  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (error) {
    if (file !== undefined) await fileStorage.delete({ fileName: key })
    throw error
  }
  return userProfile  
}

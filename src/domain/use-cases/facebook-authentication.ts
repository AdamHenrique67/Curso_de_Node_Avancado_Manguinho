import { LoadFacebookUser } from '@/domain/contracts/gateways'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '../contracts/gateways'
import { SaveFacebookAccount, LoadUserAccount } from '../contracts/repos'

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepo: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication

export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepo, token): FacebookAuthentication =>
  async (params) => {
    const fbData = await facebook.loadUser({ token: params.token }) // Poderia passar apenas params nesse caso
    if (fbData !== undefined) {
      const accountData = await userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
      const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMS })
      return { accessToken }
    }
    throw new AuthenticationError()
  }

import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '../contracts/crypto'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => FacebookAuthentication

export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepo, crypto): FacebookAuthentication =>
  async (params) => {
    const fbData = await facebookApi.loadUser({ token: params.token }) // Poderia passar apenas params nesse caso
    if (fbData !== undefined) {
      const accountData = await userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
      const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMS })
      return { accessToken }
    }
    throw new AuthenticationError()
  }

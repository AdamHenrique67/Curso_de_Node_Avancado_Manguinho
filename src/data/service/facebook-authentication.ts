import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser({ token: params.token }) // Poderia passar apenas params nesse caso
    if (fbData !== undefined) {
      await this.userAccountRepo.load({ email: fbData.email })
      await this.userAccountRepo.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}

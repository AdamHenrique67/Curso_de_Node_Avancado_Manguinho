import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebookAccount } from '@/domain/entities'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUser>
  let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
    token = 'any_token'
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto)
  })

  test('should call LoadFacebookUser with correct params', async () => {
    await sut({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
    await sut({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should call SaveFacebookAccount with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementationOnce(() => ({ any: 'any' }))
    jest.mocked(FacebookAccount).mockImplementationOnce(FacebookAccountStub)
    await sut({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct params', async () => {
    await sut({ token })

    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMS
    })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })

  test('should call return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  test('should rethrow if LoadFacebookUser throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const response = sut({ token })

    await expect(response).rejects.toThrow(new Error('fb_error'))
  })
  test('should rethrow if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const response = sut({ token })

    await expect(response).rejects.toThrow(new Error('load_error'))
  })

  test('should rethrow if SaveFacebookUserApi throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const response = sut({ token })

    await expect(response).rejects.toThrow(new Error('save_error'))
  })

  test('should rethrow if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('token_error'))

    const response = sut({ token })

    await expect(response).rejects.toThrow(new Error('token_error'))
  })
})

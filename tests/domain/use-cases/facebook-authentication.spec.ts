import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '@/domain/contracts/crypto'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthenticationUseCase', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthenticationUseCase
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
    crypto.generateToken.mockResolvedValue('any_generated_token')
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepo, crypto)
  })

  test('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  test('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest.fn().mockImplementationOnce(() => ({ any: 'any' }))
    jest.mocked(FacebookAccount).mockImplementationOnce(FacebookAccountStub)
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMS
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  test('should call return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  test('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const response = sut.perform({ token })

    await expect(response).rejects.toThrow(new Error('fb_error'))
  })
  test('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const response = sut.perform({ token })

    await expect(response).rejects.toThrow(new Error('load_error'))
  })

  test('should rethrow if SaveFacebookUserApi throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const response = sut.perform({ token })

    await expect(response).rejects.toThrow(new Error('save_error'))
  })

  test('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

    const response = sut.perform({ token })

    await expect(response).rejects.toThrow(new Error('token_error'))
  })
})

import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/entities'
import { HttpResponse, unauthorized, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '../validation'
import { Controller } from './controller'

type HttpRequest = {
  token: string
}

type Model = Error | {accessToken: string}
export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token })
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]
  }
}

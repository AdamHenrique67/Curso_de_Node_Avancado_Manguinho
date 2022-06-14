import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { badRequest, HttpResponse, serverError, unauthorized, ok } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | {accessToken: string}
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }
      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (result instanceof AccessToken) {
        return ok({ accessToken: result.value })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

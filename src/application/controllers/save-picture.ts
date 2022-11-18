import { ChangeProfilePicture } from '@/domain/use-cases'
import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from './controller'
import { Validator, ValidationBuilder as Builder } from '@/application/validation'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { initials?: string, pictureUrl?: string}

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  override async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(result)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: file, fieldName: 'file' }).required().image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 }).build()
    ]
  }
}

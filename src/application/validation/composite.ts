import { Validator } from '@/application/validation'

export class ValidatorComposite {
  constructor (private readonly valdators: Validator[]) {}

  validate (): Error | undefined {
    for (const validator of this.valdators) {
      const error = validator.validate()
      if (error) {
        return error
      }
    }
  }
}

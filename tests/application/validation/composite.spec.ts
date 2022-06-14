import { mock, MockProxy } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidatorComposite {
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

describe('ValidationComposite', () => {
  let sut: ValidatorComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]

  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
  })

  beforeEach(() => {
    validators = [validator1, validator2]
    sut = new ValidatorComposite(validators)
  })

  test('should return undefined if all Validators return undefined', () => {
    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

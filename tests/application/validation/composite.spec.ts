import { mock, MockProxy } from 'jest-mock-extended'
import { Validator, ValidatorComposite } from '@/application/validation'

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

  test('should return the first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('erro1'))
    validator2.validate.mockReturnValueOnce(new Error('erro2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('erro1'))
  })

  test('should return the error', () => {
    validator1.validate.mockReturnValueOnce(undefined)
    validator2.validate.mockReturnValueOnce(new Error('erro2'))

    const error = sut.validate()

    expect(error).toEqual(new Error('erro2'))
  })
})

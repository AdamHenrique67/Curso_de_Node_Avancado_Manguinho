import { mock, MockProxy } from 'jest-mock-extended'
import { Validator, ValidationComposite } from '@/application/validation'

describe('ValidationComposite', () => {
  let sut: ValidationComposite
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
    sut = new ValidationComposite(validators)
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

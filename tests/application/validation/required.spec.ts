import { RequiredFieldError } from '@/application/errors'
import { Required, RequiredBuffer, RequiredString } from '@/application/validation'

describe('Required', () => {
  test('should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('should return RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('should return undefined if value is not empty', () => {
    const sut = new Required('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

describe('RequiredString', () => {
  test('should extends Required', () => {
    const sut = new RequiredString('')

    expect(sut).toBeInstanceOf(Required)
  })

  test('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  test('should return undefined if value is not empty', () => {
    const sut = new RequiredString('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

describe('RequiredBuffer', () => {
  test('should extends Required', () => {
    const sut = new RequiredBuffer(Buffer.from('any_buffer'))

    expect(sut).toBeInstanceOf(Required)
  })

  test('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredBuffer(Buffer.from(''))

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError())
  })

  test('should return undefined if value is not empty', () => {
    const sut = new RequiredBuffer(Buffer.from('any_Buffer'))

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})

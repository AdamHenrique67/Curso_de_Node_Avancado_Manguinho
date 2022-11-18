import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  test('should return RequiredString', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })

  test('should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: buffer, fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer, 'any_name')])
  })

  test('should return Required', () => {
    const validators = ValidationBuilder
      .of({ value: { any: 'any' } })
      .required()
      .build()

    expect(validators).toEqual([new Required({ any: 'any' })])
  })

  test('should return correct imae validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer } })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new MaxFileSize(5, buffer)])
  })

  test('should return correct image validators', () => {
    const validators = ValidationBuilder
      .of({ value: { mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  test('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder
      .of({ value: { buffer, mimeType: 'image/png' } })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(5, buffer)
    ])
  })
})

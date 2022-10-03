import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  test('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  test('Should create initials with first letter of first and last names', () => {
    sut.setPicture({ pictureUrl: undefined, name: 'Adam Henrique Anicio Marcal' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'AM'
    })
  })

  test('Should create initials with first two letters of first name', () => {
    sut.setPicture({ pictureUrl: undefined, name: 'Adam' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'AD'
    })
  })

  test('Should create initials with first two letters of first name', () => {
    sut.setPicture({ pictureUrl: undefined, name: 'A' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'A'
    })
  })

  test('Should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ pictureUrl: undefined, name: undefined })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})

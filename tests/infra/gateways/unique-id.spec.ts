import { UniqueId } from '@/infra/gateways'

describe('UniqueId', () => {
  test('should call uuid.v4', () => {
    const sut = new UniqueId(new Date(2022, 9, 3, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20221003101010')
  })
})

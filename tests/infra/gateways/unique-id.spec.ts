import { UniqueId } from '@/infra/gateways'

import { set, reset } from 'mockdate'

describe('UniqueId', () => {
  let sut: UniqueId

  beforeAll(() => {
    set(new Date(2022, 9, 3, 10, 10, 10))
    sut = new UniqueId()
  })

  afterAll(() => {
    reset()
  })
  test('should create a unique id', () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20221003101010')
  })
})

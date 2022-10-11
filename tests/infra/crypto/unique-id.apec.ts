import { UUIDGenerator } from '@/domain/contracts/gateways'

class UniqueId implements UUIDGenerator {
  constructor (private readonly date: Date) {}

  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return key +
    '_' +
    this.date.getFullYear.toString() +
    (this.date.getMonth() + 1).toString().padStart(2, '0') +
    this.date.getDate().toString().padStart(2, '0') +
    this.date.getHours().toString().padStart(2, '0') +
    this.date.getMinutes().toString().padStart(2, '0') +
    this.date.getSeconds().toString().padStart(2, '0')
  }
}

describe('UniqueId', () => {
  test('should call uuid.v4', () => {
    const sut = new UniqueId(new Date(2022, 9, 3, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20221003101010')
  })
})

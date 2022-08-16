export class AccessToken {
  constructor (public readonly value: string) {}

  static get expirationInMS (): number {
    return 30 * 60 * 1000
  }
}

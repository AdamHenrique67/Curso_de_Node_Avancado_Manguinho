export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => void
}

export namespace TokenGenerator {
  export type Params = {
    key: string
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsopported type. Allowed types:${allowed.join(', ')}`)
    this.name = 'InvalidMymeTypeError'
  }
}

export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}
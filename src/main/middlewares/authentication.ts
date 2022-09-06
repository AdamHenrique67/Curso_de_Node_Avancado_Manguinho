import { adaptExpressMiddleware } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication'

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware())

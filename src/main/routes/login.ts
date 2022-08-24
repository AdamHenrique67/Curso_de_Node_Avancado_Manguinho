import { adaptExpressRoute as adapt } from '@/main/adapters'
import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers'

export default (router: Router): void => {
  const controller = makeFacebookLoginController()
  router.post('/login/facebook', adapt(controller))
}

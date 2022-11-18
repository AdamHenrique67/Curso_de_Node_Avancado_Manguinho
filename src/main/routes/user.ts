import { adaptExpressRoute as adapt } from '@/main/adapters'
import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { makeDeletePictureController } from '../factories/controllers'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeDeletePictureController()))
}

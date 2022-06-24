import express from 'express'
import { setupMiddlewares } from '@/main/config/middlewares'
import { setupRoutes } from './routes'

export const app = express()
setupMiddlewares(app)
setupRoutes(app)

import exrpress from 'express'
import authController from '../controllers/auth.controller'

const authRouter = exrpress.Router()

authRouter.get('/redirect', authController.redirectToAtlassian)

export default authRouter

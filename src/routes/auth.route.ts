import express from 'express'
import authController from '../controllers/auth.controller'

const authRouter = express.Router()

authRouter.get('/redirect', authController.redirectToAtlassian)
authRouter.get('/callback', authController.handleOauthCallback)

export default authRouter

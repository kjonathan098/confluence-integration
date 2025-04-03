import express from 'express' // ✅ correct
import authController from '../controllers/auth.controller'

const authRouter = express.Router() // ✅ now express is defined

authRouter.get('/redirect', authController.redirectToAtlassian)
authRouter.get('/callback', authController.handleOauthCallback)

export default authRouter
 
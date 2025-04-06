import express from 'express'
import spaceController from '../controllers/spaces.controller'
import verifyUserInSession from '../middleware/verifyUserSession'
import { ensureValidAccessToken } from '../middleware/ensureValidAccessToken'

const spacesRouter = express.Router()

spacesRouter.get('/', ensureValidAccessToken, spaceController.getSpaces)
spacesRouter.get('/postman', spaceController.getSpacesPostman)

export default spacesRouter

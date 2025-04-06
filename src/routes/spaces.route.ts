import express from 'express'
import spaceController from '../controllers/spaces.controller'
import verifyUserInSession from '../middleware/verifyUserSession'

const spacesRouter = express.Router()

spacesRouter.get('/', verifyUserInSession, spaceController.getSpaces)
// spacesRouter.get('/postman', spaceController.getSpacesPostman)

export default spacesRouter

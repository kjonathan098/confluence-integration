import express from 'express'
import pagesController from '../controllers/pages.controller'
import { ensureValidAccessToken } from '../middleware/ensureValidAccessToken'

const pagesRouter = express.Router()

pagesRouter.get('/:cloudId/:spaceKey', ensureValidAccessToken, pagesController.getPages)
pagesRouter.get('/dev/:cloudId/:spaceKey', pagesController.getPagesDev)
export default pagesRouter

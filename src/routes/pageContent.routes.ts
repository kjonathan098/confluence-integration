import express from 'express'
import pageContentController from '../controllers/pageContent.controller'
import { ensureValidAccessToken } from '../middleware/ensureValidAccessToken'

const pageContentRouter = express.Router()

pageContentRouter.get('/:cloudId/:pageId', ensureValidAccessToken, pageContentController.getPageContent)
pageContentRouter.get('/dev/:cloudId/:pageId', pageContentController.getPageContentDev)
export default pageContentRouter

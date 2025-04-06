import express from 'express'
import pageContentController from '../controllers/pageContent.controller'
import verifyUserInSession from '../middleware/verifyUserSession'

const pageContentRouter = express.Router()

pageContentRouter.get('/:cloudId/:pageId',verifyUserInSession, pageContentController.getPageContent)
pageContentRouter.get('/dev/:cloudId/:pageId', pageContentController.getPageContentDev)
export default pageContentRouter

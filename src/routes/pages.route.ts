import express from 'express'
import pagesController from '../controllers/pages.controller'
import verifyUserInSession from '../middleware/verifyUserSession'

const pagesRouter = express.Router()

pagesRouter.get('/:cloudId/:spaceKey', verifyUserInSession, pagesController.getPages)
pagesRouter.get('/dev/:cloudId/:spaceKey', pagesController.getPagesDev)
export default pagesRouter

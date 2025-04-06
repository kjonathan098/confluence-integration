import axios from 'axios'
import express, { Request, Response } from 'express'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import getAccessibleResources from '../utils/getAccessibleResources'
import { respondError, respondSuccess } from '../utils/respond'
import { ConfluencePagesResponse } from '../../types/confluence'
import { handleAxiosError } from '../utils/handleAxiosErrrors'
import pagesController from '../controllers/pages.controller'
import verifyUserInSession from '../middleware/verifyUserSession'

const pagesRouter = express.Router()

pagesRouter.get('/:cloudId/:spaceKey', verifyUserInSession, pagesController.getPages)
// pagesRouter.get('/:cloudId/:spaceKey', pagesController.getPagesDev)
export default pagesRouter

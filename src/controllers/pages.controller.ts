import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { ConfluencePagesResponse } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { respondSuccess } from '../utils/respond'
import { AppError } from '../utils/appErrorClass'

const getPages = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.session.accessToken

	const { cloudId, spaceKey } = req.params

	try {
		const pages = await axios.get<ConfluencePagesResponse>(`${ATLASSIAN_API_BASE}/ex/confluence/${cloudId}/wiki/rest/api/content`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
			params: {
				spaceKey,
				type: 'page',
				limit: 25,
				start: 0,
			},
		})
		respondSuccess(res, pages.data)
	} catch (err: any) {
		return next(new AppError(err.message || 'Error fetching pages', err.status))
	}
}

/* this is so test coverage ignore this function  */
// istanbul ignore next
const getPagesDev = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.query.token
	if (!accessToken) {
		req.session.returnTo = req.originalUrl
		res.send('no access token found')
		return
	}

	const { cloudId, spaceKey } = req.params

	try {
		const pages = await axios.get<ConfluencePagesResponse>(`${ATLASSIAN_API_BASE}/ex/confluence/${cloudId}/wiki/rest/api/content`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
			params: {
				spaceKey,
				type: 'page',
				limit: 25,
				start: 0,
			},
		})
		respondSuccess(res, pages.data)
	} catch (err: any) {
		console.error('Get Pagest Error :', err.message || err)
		return next(new AppError(err.message || 'Error fetching pages', err.status))
	}
}

const pagesController = { getPages, getPagesDev }
export default pagesController

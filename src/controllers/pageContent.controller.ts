import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { ConfluencePage } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { respondSuccess } from '../utils/respond'
import { AppError } from '../utils/appErrorClass'

const getPageContent = async (req: Request, res: Response, next: NextFunction) => {
	const { cloudId, pageId } = req.params
	const accessToken = req.session.accessToken as string
	const format = (req.query?.format ?? '') as string

	try {
		const pageContent = await axios.get<ConfluencePage>(`${ATLASSIAN_API_BASE}/ex/confluence/${cloudId}/wiki/rest/api/content/${pageId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
			params: {
				expand: 'body.storage',
			},
		})

		const { id, title, body } = pageContent.data
		const content = body?.storage?.value
		if (format === 'html') {
			res.set('Content-Type', 'text/html')
			res.send(content)
		} else {
			respondSuccess(res, {
				id,
				title,
				content,
			})
		}
	} catch (err: any) {
		console.error('Get Pagest Error :', err.message || err)
		return next(new AppError(err.message || 'Error fetching pages', err.status))
	}
}

/* this is so test coverage ignore this function  */
// istanbul ignore next
const getPageContentDev = async (req: Request, res: Response, next: NextFunction) => {
	const { cloudId, pageId } = req.params
	const accessToken = req.query.token as string

	try {
		const pageContent = await axios.get<ConfluencePage>(`${ATLASSIAN_API_BASE}/ex/confluence/${cloudId}/wiki/rest/api/content/${pageId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
			params: {
				expand: 'body.storage',
			},
		})

		const { id, title, body } = pageContent.data
		const content = body?.storage?.value

		respondSuccess(res, {
			id,
			title,
			content,
		})
	} catch (err: any) {
		console.error('Get Pagest Error :', err.message || err)
		return next(new AppError(err.message || 'Error fetching pages', err.status))
	}
}

const pageContentController = { getPageContentDev, getPageContent }
export default pageContentController

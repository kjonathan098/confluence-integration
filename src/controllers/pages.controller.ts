import axios from 'axios'
import { Request, Response } from 'express'
import { ConfluencePagesResponse } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { handleAxiosError } from '../utils/handleAxiosErrrors'
import { respondError, respondSuccess } from '../utils/respond'

const getPages = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		handleAxiosError(res, error, 'An unknown error occurred while fetching pages from Confluence.')
	}
}

// istanbul ignore next
const getPagesDev = async (req: Request, res: Response) => {
	const access_token = req.session.accessToken
	if (!access_token) {
		req.session.returnTo = req.originalUrl
		res.send('hi')
		return
	}

	const accessToken = req.query.token
	const { cloudId, spaceKey } = req.params

	if (!accessToken) {
		// TODO ADD MIDDLEWARE
		res.redirect('/api/oauth/redirect')
		return
	}

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
	} catch (error: any) {
		handleAxiosError(res, error, 'An unknown error occurred while fetching pages from Confluence.')
	}
}

const pagesController = { getPages }
export default pagesController

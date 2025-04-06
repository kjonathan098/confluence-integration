import axios from 'axios'
import { Request, Response } from 'express'
import { ConfluencePagesResponse } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { handleAxiosError } from '../utils/handleAxiosErrrors'
import { respondSuccess } from '../utils/respond'

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

/* this is so test coverage ignore this function  */
// istanbul ignore next
const getPagesDev = async (req: Request, res: Response) => {
	const accessToken = req.query.token
	console.log(accessToken)
	if (!accessToken) {
		req.session.returnTo = req.originalUrl
		res.send('no access token found')
		return
	}

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

const pagesController = { getPages, getPagesDev }
export default pagesController

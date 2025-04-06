import axios from 'axios'
import { Request, Response } from 'express'
import { ConfluencePage } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { handleAxiosError } from '../utils/handleAxiosErrrors'
import { respondSuccess } from '../utils/respond'

const getPageContent = async (req: Request, res: Response) => {
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
	} catch (error) {
		handleAxiosError(res, error, 'Failed to fetch page content from Confluence.')
	}
}
// istanbul ignore next
const getPageContentDev = async (req: Request, res: Response) => {
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
	} catch (error) {
		handleAxiosError(res, error, 'Failed to fetch page content from Confluence.')
	}
}

const pageContentController = { getPageContentDev, getPageContent }
export default pageContentController

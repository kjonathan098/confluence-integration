import { Request, Response } from 'express'
import querystring from 'querystring'
import { CONFLUENCE_SCOPES } from '../constants/oauth'
import axios from 'axios'
import { exchangeCodeForToken } from '../utils/oauth'
import { sendResponse } from '../utils/response'

const redirectToAtlassian = (req: Request, res: Response) => {
	if (!process.env.CLIENT_ID || !process.env.REDIRECT_URI) {
		return res.status(500).send('Missing required environment variables')
	}
	// build the authorization URL
	const query = querystring.stringify({
		audience: 'api.atlassian.com',
		client_id: process.env.CLIENT_ID,
		scope: CONFLUENCE_SCOPES.join(' '),
		redirect_uri: process.env.REDIRECT_URI,
		response_type: 'code',
		prompt: 'consent',
	})

	const url = `https://auth.atlassian.com/authorize?${query}`
	res.redirect(url)
}

const handleOauthCallback = async (req: Request, res: Response): Promise<void> => {
	// get code from query params
	const code = req.query.code as string

	if (!code) {
		sendResponse(res, 400, 'Missing authorization code')
		return
	}

	try {
		const { access_token, refresh_token, expires_in } = await exchangeCodeForToken(code)

		sendResponse(res, 200, {
			message: 'OAuth flow completed!',
			access_token,
			refresh_token,
			expires_in,
		})
	} catch (error: any) {
		throw {
			status: 500,
			message: 'Failed to exchange code for token',
		}
	}
}

const authController = { redirectToAtlassian, handleOauthCallback }
export default authController

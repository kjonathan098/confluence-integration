import { Request, Response } from 'express'
import querystring from 'querystring'
import { CONFLUENCE_SCOPES } from '../constants/oauth'
import axios from 'axios'
import { exchangeCodeForToken } from '../utils/oauth'
import { respondError, respondSuccess } from '../utils/respond'

const redirectToAtlassian = (req: Request, res: Response) => {
	if (!process.env.CLIENT_ID || !process.env.REDIRECT_URI) {
		respondError(res, 'Missing required environment variables')
		return
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
		respondError(res, 'Missing authorization code', 400)
		return
	}

	try {
		const { access_token, refresh_token, expires_in } = await exchangeCodeForToken(code)
		req.session.accessToken = access_token

		respondSuccess(res, { message: 'OAuth flow completed!' }, 200)
	} catch (error: any) {
		throw {
			status: 500,
			message: 'Failed to exchange code for token',
		}
	}
}

const authController = { redirectToAtlassian, handleOauthCallback }
export default authController

const testSession = {} as Express.Request['session']
testSession.accessToken

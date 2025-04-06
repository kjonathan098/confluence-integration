import { Request, Response } from 'express'
import querystring from 'querystring'
import { CONFLUENCE_SCOPES } from '../constants/oauth'
import { exchangeCodeForToken } from '../utils/exchangeCodeForToken'
import { respondError } from '../utils/respond'

const redirectToAtlassian = (req: Request, res: Response) => {
	if (!process.env.CLIENT_ID || !process.env.REDIRECT_URI) {
		respondError(res, 'Server misconfiguration: required environment variables are missing')
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
		req.session.refreshToken = refresh_token
		req.session.tokenExpiry = Date.now() + expires_in * 1000

		/* test refresh token */
		// req.session.tokenExpiry = Date.now() - 1000 // expired 1 second ago

		/* to get an access_token  and use it in postman for dev mode uncomment this */
		// res.send(access_token)
		// return

		const redirectURL = req.session.returnTo ? req.session.returnTo : '/api/spaces'
		res.redirect(redirectURL)
	} catch (error: any) {
		console.error('OAuth callback error:', error.response?.data || error.message || error)
		respondError(res, 'Failed to exchange code for token', 500)
	}
}

const authController = { redirectToAtlassian, handleOauthCallback }
export default authController

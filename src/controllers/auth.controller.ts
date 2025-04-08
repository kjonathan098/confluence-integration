import { NextFunction, Request, Response } from 'express'
import querystring from 'querystring'
import { CONFLUENCE_SCOPES } from '../constants/oauth'
import { exchangeCodeForToken } from '../utils/exchangeCodeForToken'
import { AppError } from '../utils/appErrorClass'

const redirectToAtlassian = (req: Request, res: Response, next: NextFunction) => {
	if (!process.env.CLIENT_ID || !process.env.REDIRECT_URI) {
		return next(new AppError('Server misconfiguration: required environment variables are missing', 500))
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

const handleOauthCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// get code from query params
	const code = req.query.code as string

	if (!code) {
		return next(new AppError('Missing authoriazon Code', 400))
	}

	try {
		const { access_token, refresh_token, expires_in } = await exchangeCodeForToken(code)
		req.session.accessToken = access_token
		req.session.refreshToken = refresh_token
		req.session.tokenExpiry = Date.now() + expires_in * 1000

		/* test refresh token */
		// req.session.tokenExpiry = Date.now() - 1000 // expired 1 second ago

		// /* to get an access_token  and use it in postman for dev mode uncomment this */
		// // res.send(access_token)
		// // return

		const redirectURL = req.session.returnTo ? req.session.returnTo : '/api/spaces'
		res.redirect(redirectURL)
	} catch (err: any) {
		console.error('OAuth callback token exchange error:', err.message || err)
		next(new AppError(err.message || 'Failed to exchange code for token', err.status))
	}
}

const authController = { redirectToAtlassian, handleOauthCallback }
export default authController

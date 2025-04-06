import { Request, Response, NextFunction } from 'express'
import { refreshAccessToken } from '../utils/refreshAccessToken'

export const ensureValidAccessToken = async (req: Request, res: Response, next: NextFunction) => {
	const { accessToken, refreshToken, tokenExpiry } = req.session
	req.session.returnTo = req.originalUrl

	// if user is not in session re-driect to oauth
	if (!accessToken) {
		return res.redirect('/api/oauth/redirect')
	}

	// check if we need to refresh token
	if (tokenExpiry && Date.now() >= tokenExpiry && refreshToken) {
		try {
			const newTokens = await refreshAccessToken(refreshToken)
			req.session.accessToken = newTokens.access_token
			req.session.tokenExpiry = Date.now() + newTokens.expires_in * 1000

			if (newTokens.refresh_token) req.session.refreshToken = newTokens.refresh_token
			console.log('Refreshed access token.')
		} catch (err) {
			console.error('Failed to refresh token:', err)
			return res.redirect('/api/oauth/redirect')
		}
	}

	next()
}

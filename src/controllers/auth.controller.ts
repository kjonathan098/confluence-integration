import { Request, Response } from 'express'
import querystring from 'querystring'
import { CONFLUENCE_SCOPES } from '../constants/oauth'

const redirectToAtlassian = (req: Request, res: Response) => {
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

const authController = { redirectToAtlassian }
export default authController

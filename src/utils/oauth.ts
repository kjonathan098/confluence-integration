import axios from 'axios'
import { buildErrorResponseFormat } from './respond'

export const exchangeCodeForToken = async (code: string) => {
	try {
		const response = await axios.post(
			'https://auth.atlassian.com/oauth/token',
			{
				grant_type: 'authorization_code',
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				redirect_uri: process.env.REDIRECT_URI,
				code,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
		return response.data
	} catch (error) {
		throw new Error(buildErrorResponseFormat('Failed to exchange authorization code for access token'))
	}
}

import axios from 'axios'
import { buildErrorResponseFormat } from './respond'
import { AtlassianTokenResponse } from '../../types/AtlassianTokenResponse'

export const exchangeCodeForToken = async (code: string): Promise<AtlassianTokenResponse> => {
	const response = await axios.post<AtlassianTokenResponse>(
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
}

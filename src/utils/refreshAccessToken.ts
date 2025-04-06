import axios from 'axios'
import { AtlassianTokenResponse } from '../../types/AtlassianTokenResponse'

export const refreshAccessToken = async (refreshToken: string) => {
	const params = new URLSearchParams()
	params.append('grant_type', 'refresh_token')
	params.append('client_id', process.env.CLIENT_ID!)
	params.append('client_secret', process.env.CLIENT_SECRET!)
	params.append('refresh_token', refreshToken)

	const response = await axios.post<AtlassianTokenResponse>('https://auth.atlassian.com/oauth/token', params, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	})

	return response.data
}

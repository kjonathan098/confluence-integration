import axios from 'axios'

export const exchangeCodeForToken = async (code: string) => {
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
}

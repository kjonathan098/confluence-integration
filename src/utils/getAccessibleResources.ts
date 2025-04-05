import axios from 'axios'
import { AccessibleResource } from '../../types/confluence'

const getAccessibleResources = async (accessToken: string): Promise<AccessibleResource[]> => {
	const res = await axios.get<AccessibleResource[]>('https://api.atlassian.com/oauth/token/accessible-resources', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
	})

	return res.data
}

export default getAccessibleResources

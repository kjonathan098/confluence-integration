import axios from 'axios'
import { AccessibleResource } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { buildErrorResponseFormat, respondError } from './respond'

const getAccessibleResources = async (accessToken: string): Promise<AccessibleResource[]> => {
	const res = await axios.get<AccessibleResource[]>(`${ATLASSIAN_API_BASE}/oauth/token/accessible-resources`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
	})

	return res.data
}

export default getAccessibleResources

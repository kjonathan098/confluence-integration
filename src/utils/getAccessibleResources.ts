import axios from 'axios'
import { AccessibleResource } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { buildErrorResponseFormat, respondError } from './respond'

const getAccessibleResources = async (accessToken: string): Promise<AccessibleResource[]> => {
	try {
		const res = await axios.get<AccessibleResource[]>(`${ATLASSIAN_API_BASE}/oauth/token/accessible-resources`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		})

		return res.data
	} catch (error) {
		throw new Error(buildErrorResponseFormat('Failed to fetch accessible resources from Atlassian'))
	}
}

export default getAccessibleResources

import axios from 'axios'
import { AccessibleResource } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { respondError } from './respond'

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
		// This is a standalone helper function, so we don't handle the response object directly.
		// Instead, we manually throw a JSON-formatted error that matches the global error response structure.

		throw new Error(JSON.stringify({ success: false, message: 'Failed to fetch accessible resources from Atlassian' }))
	}
}

export default getAccessibleResources

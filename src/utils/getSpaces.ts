import axios from 'axios'
import { ConfluenceSpacesResponse } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'
import { buildErrorResponseFormat } from './respond'

const getUserSpaces = async (accessToken: string, cloudId: string) => {
	try {
		const spacesRes = await axios.get<ConfluenceSpacesResponse>(`${ATLASSIAN_API_BASE}/ex/confluence/${cloudId}/wiki/rest/api/space`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		})
		return spacesRes.data
	} catch (error) {
		throw new Error(buildErrorResponseFormat('Failed to fetch accessible resources from Atlassian'))
	}
}
export default getUserSpaces

import axios from 'axios'
import { ConfluenceSpacesResponse } from '../../types/confluence'
import { ATLASSIAN_API_BASE } from '../constants/attlasian'

const getUserSpaces = async (accessToken: string, cloudId: string) => {
	const spacesRes = await axios.get<ConfluenceSpacesResponse>(`${ATLASSIAN_API_BASE}/ex/confluence/${cloudId}/wiki/rest/api/space`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
	})
	return spacesRes.data
}
export default getUserSpaces

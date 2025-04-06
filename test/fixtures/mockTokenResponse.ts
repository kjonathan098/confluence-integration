import { AtlassianTokenResponse } from '../../types/AtlassianTokenResponse'

export const mockTokenResponse: AtlassianTokenResponse = {
	access_token: 'mock-access',
	refresh_token: 'mock-refresh',
	expires_in: 3600,
	scope: 'read:confluence-space.summary',
	token_type: 'Bearer',
}

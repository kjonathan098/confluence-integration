// test/utils/refreshAccessToken.spec.ts

import { expect } from 'chai'
import nock from 'nock'
import { refreshAccessToken } from '../../src/utils/refreshAccessToken'

describe('refreshAccessToken', () => {
	it('should return new tokens when called with valid refresh token', async () => {
		const mockResponse = {
			access_token: 'new-access-token',
			refresh_token: 'new-refresh-token',
			expires_in: 3600,
			scope: 'read:confluence-space.summary',
			token_type: 'Bearer',
		}

		nock('https://auth.atlassian.com').post('/oauth/token').reply(200, mockResponse)

		const result = await refreshAccessToken('valid-refresh-token')
		expect(result.access_token).to.equal('new-access-token')
	})
})

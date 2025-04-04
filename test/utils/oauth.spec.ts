import { expect } from 'chai'
import sinon from 'sinon'
import axios from 'axios'
import { exchangeCodeForToken } from '../../src/utils/oauth'
import { isError } from 'joi'

describe('exchangeCodeForToken', () => {
	let postStub: sinon.SinonStub

	beforeEach(() => {
		// Set dummy env vars
		process.env.CLIENT_ID = 'test-client-id'
		process.env.CLIENT_SECRET = 'test-client-secret'
		process.env.REDIRECT_URI = 'http://localhost/callback'

		// Stub axios.post
		postStub = sinon.stub(axios, 'post')
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should post to Atlassian and return token data', async () => {
		const mockResponse = {
			data: {
				access_token: 'mock-token',
				refresh_token: 'mock-refresh',
				expires_in: 3600,
			},
		}

		postStub.resolves(mockResponse)

		const result = await exchangeCodeForToken('abc123')

		expect(postStub.calledOnce).to.be.true
		expect(postStub.firstCall.args[0]).to.equal('https://auth.atlassian.com/oauth/token')
		expect(postStub.firstCall.args[1]).to.deep.equal({
			grant_type: 'authorization_code',
			client_id: 'test-client-id',
			client_secret: 'test-client-secret',
			redirect_uri: 'http://localhost/callback',
			code: 'abc123',
		})
		console.log('hi')
		expect(result).to.deep.equal(mockResponse.data)
		console.log('goodbye')
	})

	it('should throw if axios.post fails', async () => {
		postStub.rejects(new Error('boom'))

		try {
			await exchangeCodeForToken('fail-code')
			throw new Error('Should have thrown')
		} catch (err) {
			expect((err as Error).message).to.equal('boom')
		}
	})
})

import { expect } from 'chai'
import sinon from 'sinon'
import axios from 'axios'
import getAccessibleResources from '../../src/utils/getAccessibleResources'
import { ATLASSIAN_API_BASE } from '../../src/constants/attlasian'
import { expectErrorResponse } from '../helpers/assertResponses'
import { ErrorResponse } from '../../types/responseTypes'

describe('getAccessibleResources', () => {
	const mockToken = 'mock-access-token'
	const mockResponse = [
		{
			id: 'site-id',
			url: 'https://mock-site.atlassian.net',
			name: 'Mock Site',
			scopes: ['read:confluence-space.summary'],
			avatarUrl: 'https://mock-avatar.url',
		},
	]

	let axiosGetStub: sinon.SinonStub

	beforeEach(() => {
		axiosGetStub = sinon.stub(axios, 'get').resolves({ data: mockResponse })
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should call the correct Atlassian API endpoint with headers', async () => {
		const result = await getAccessibleResources(mockToken)

		const [url, config] = axiosGetStub.firstCall.args

		expect(axiosGetStub.calledOnce).to.be.true
		expect(url).to.equal(`${ATLASSIAN_API_BASE}/oauth/token/accessible-resources`)
		expect(config.headers.Authorization).to.equal(`Bearer ${mockToken}`)
		expect(config.headers.Accept).to.equal('application/json')
		expect(result).to.deep.equal(mockResponse)
	})

	it('should throw an error if axios fails', async () => {
		sinon.restore()

		sinon.stub(axios, 'get').rejects(new Error('boom'))
		//
		try {
			await getAccessibleResources('mockToken')
			throw new Error('Expected error was not thrown') // fail the test if no error is thrown
		} catch (err: any) {
			const parsed = JSON.parse(err.message)

			expect(err).to.be.instanceOf(Error)

			// Assert that the parsed error object matches the expected error response structure,
			// using Sinon’s matcher to allow flexible validation (e.g., message is any string).
			// `.satisfy()` is used here because Chai's `.deep.include()` can't handle Sinon matchers.

			expect(parsed).to.satisfy((obj: ErrorResponse) => sinon.match(expectErrorResponse).test(obj))
		}
	})
})

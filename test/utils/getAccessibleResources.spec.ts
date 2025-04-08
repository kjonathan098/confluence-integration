import sinon from 'sinon'
import axios from 'axios'
import getAccessibleResources from '../../src/utils/getAccessibleResources'
import { ATLASSIAN_API_BASE } from '../../src/constants/attlasian'
import { expectErrorResponse } from '../helpers/assertResponses'
import { ErrorResponse } from '../../types/responseTypes'
import { AppError } from '../../src/utils/appErrorClass'
import * as chai from 'chai'

const expect = chai.expect

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
		axiosGetStub = sinon.stub(axios, 'get')
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should call the correct Atlassian API endpoint with headers', async () => {
		// Resolve the stub with mock data
		axiosGetStub.resolves({ data: mockResponse })

		const result = await getAccessibleResources(mockToken)

		const [url, config] = axiosGetStub.firstCall.args

		expect(axiosGetStub.calledOnce).to.be.true
		expect(url).to.equal(`${ATLASSIAN_API_BASE}/oauth/token/accessible-resources`)
		expect(config.headers.Authorization).to.equal(`Bearer ${mockToken}`)
		expect(config.headers.Accept).to.equal('application/json')
		expect(result).to.deep.equal(mockResponse)
	})

	it('should handle Axios error gracefully', async () => {
		// Reject the stub with an error
		const axiosError = new Error('mock-fail-message')
		axiosGetStub.rejects(axiosError)

		try {
			await getAccessibleResources('mockToken')
			throw new Error('Expected error was not thrown') // Fail the test if no error is thrown
		} catch (err: any) {
			expect(err).to.be.instanceOf(Error)
			expect(err.message).to.equal('mock-fail-message')
		}
	})
})

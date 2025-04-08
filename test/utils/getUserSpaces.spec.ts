import { expect } from 'chai'
import sinon from 'sinon'
import axios from 'axios'
import getUserSpaces from '../../src/utils/getUserSpaces'
import { ATLASSIAN_API_BASE } from '../../src/constants/attlasian'
import { expectErrorResponse } from '../helpers/assertResponses'
import { ErrorResponse, SuccessResponse } from '../../types/responseTypes'

describe('getUserSpaces', () => {
	const mockToken = 'mock-access-token'
	const mockCloudId = 'mock-cloud-id'

	const mockResponse = {
		results: [
			{
				id: 'space-id',
				name: 'Mock Space',
				type: 'global',
			},
		],
		start: 0,
		limit: 25,
		size: 1,
		_links: {},
	}

	let axiosGetStub: sinon.SinonStub

	beforeEach(() => {
		axiosGetStub = sinon.stub(axios, 'get').resolves({ data: mockResponse })
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should call the correct Atlassian API endpoint with headers', async () => {
		const result = await getUserSpaces(mockToken, mockCloudId)

		const [url, config] = axiosGetStub.firstCall.args

		expect(axiosGetStub.calledOnce).to.be.true
		expect(url).to.equal(`${ATLASSIAN_API_BASE}/ex/confluence/${mockCloudId}/wiki/rest/api/space`)
		expect(config.headers.Authorization).to.equal(`Bearer ${mockToken}`)
		expect(config.headers.Accept).to.equal('application/json')
		expect(result).to.deep.equal(mockResponse)
	})

	// it('should throw an error if axios fails', async () => {
	// 	sinon.restore()
	// 	sinon.stub(axios, 'get').rejects(new Error('boom'))

	// 	try {
	// 		await getUserSpaces(mockToken, mockCloudId)
	// 		throw new Error('Expected error was not thrown')
	// 	} catch (err: any) {
	// 		expect(err).to.be.instanceOf(Error)

	// 		const parsed = JSON.parse(err.message)

	// 		// Assert that the parsed error object matches the expected error response structure
	// 		expect(parsed).to.satisfy((obj: ErrorResponse) => sinon.match(expectErrorResponse).test(obj))
	// 	}
	// })
	it('should throw an error if axios fails', async () => {
		// Reject the stub with an error
		const axiosError = new Error('mock-fail-message')
		axiosGetStub.rejects(axiosError)

		try {
			await getUserSpaces(mockToken, mockCloudId)
			throw new Error('Expected error was not thrown')
		} catch (err: any) {
			expect(err).to.be.instanceOf(Error)

			expect(err.message).to.equal('mock-fail-message')
		}
	})
})

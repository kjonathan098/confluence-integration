import { expect } from 'chai'
import sinon from 'sinon'
import axios from 'axios'
import { Request, Response } from 'express'
import pagesController from '../../src/controllers/pages.controller'
import { expectErrorResponse, expectSuccessResponse } from '../helpers/assertResponses'
import { mockPagesResponse } from '../fixtures/mockPages'
import '../../types/session'
import { ATLASSIAN_API_BASE } from '../../src/constants/attlasian'

describe('pagesController.getPages', () => {
	let req: Partial<Request>
	let res: Partial<Response>
	let jsonStub: sinon.SinonStub
	let statusStub: sinon.SinonStub
	let axiosStub: sinon.SinonStub

	beforeEach(() => {
		jsonStub = sinon.stub()
		statusStub = sinon.stub().returns({ json: jsonStub })
		res = { status: statusStub, json: jsonStub }

		req = {
			session: {
				accessToken: 'mock-access-token',
			},
			params: {
				cloudId: 'mock-cloud-id',
				spaceKey: 'mock-space-key',
			},
		} as unknown as Request
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should return pages on success', async () => {
		axiosStub = sinon.stub(axios, 'get').resolves({ data: mockPagesResponse })

		await pagesController.getPages(req as Request, res as Response)

		expect(statusStub.calledWith(200)).to.be.true
		expect(jsonStub.calledWithMatch(expectSuccessResponse(mockPagesResponse))).to.be.true
		expect(axiosStub.calledOnce).to.be.true
	})

	it('should call axios with correct URL, headers, and params', async () => {
		axiosStub = sinon.stub(axios, 'get').resolves({ data: mockPagesResponse })

		await pagesController.getPages(req as Request, res as Response)

		const [url, config] = axiosStub.firstCall.args
		expect(url).to.equal(`${ATLASSIAN_API_BASE}/ex/confluence/mock-cloud-id/wiki/rest/api/content`)
		expect(config.headers.Authorization).to.equal('Bearer mock-access-token')
		expect(config.headers.Accept).to.equal('application/json')
		expect(config.params).to.deep.equal({
			spaceKey: 'mock-space-key',
			type: 'page',
			limit: 25,
			start: 0,
		})
	})

	it('should handle Axios error gracefully', async () => {
		axiosStub = sinon.stub(axios, 'get').rejects(new Error('boom'))

		await pagesController.getPages(req as Request, res as Response)

		expect(statusStub.calledWith(500)).to.be.true
		expect(jsonStub.calledWithMatch(expectErrorResponse)).to.be.true
	})
})

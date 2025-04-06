import { expect } from 'chai'
import sinon from 'sinon'
import axios from 'axios'
import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import pageContentController from '../../src/controllers/pageContent.controller'
import { expectErrorResponse, expectSuccessResponse } from '../helpers/assertResponses'
import { mockPage } from '../fixtures/mockPages' // should be a mock based on ConfluencePage

describe('getPageContent', () => {
	let req: Partial<Request>
	let res: Partial<Response>
	let jsonStub: sinon.SinonStub
	let statusStub: sinon.SinonStub
	let axiosStub: sinon.SinonStub
	beforeEach(() => {
		jsonStub = sinon.stub()
		statusStub = sinon.stub().returns({ json: jsonStub })

		res = {
			status: statusStub,
			json: jsonStub,
		} as unknown as Response

		req = {
			session: {
				accessToken: 'mock-access-token',
			},
			params: {
				cloudId: 'mock-cloud-id',
				pageId: 'mock-page-id',
			},
			query: {}, // no `format` here — this matches your test!
		} as unknown as Request
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should return JSON page content if no format is specified', async () => {
		axiosStub = sinon.stub(axios, 'get').resolves({ data: mockPage })

		req.query = {} // no format specified

		await pageContentController.getPageContent(req as Request, res as Response)

		expect(
			jsonStub.calledWithMatch(
				expectSuccessResponse({
					id: mockPage.id,
					title: mockPage.title,
					content: mockPage.body?.storage?.value,
				})
			)
		).to.be.true
	})

	it('should return HTML page content if format is "html"', async () => {
		const sendStub = sinon.stub()
		const setStub = sinon.stub().returns({ send: sendStub })

		res = {
			set: setStub,
			send: sendStub,
		} as unknown as Response

		req.query = { format: 'html' }

		sinon.stub(axios, 'get').resolves({ data: mockPage })

		await pageContentController.getPageContent(req as Request, res as Response)

		expect(setStub.calledWith('Content-Type', 'text/html')).to.be.true
		expect(sendStub.calledWith(mockPage.body?.storage?.value)).to.be.true
	})

	it('should handle Axios failure gracefully', async () => {
		axiosStub = sinon.stub(axios, 'get').rejects(new Error('boom'))

		await pageContentController.getPageContent(req as Request, res as Response)

		expect(statusStub.calledWith(500)).to.be.true
		expect(jsonStub.calledWithMatch(expectErrorResponse)).to.be.true
	})
})

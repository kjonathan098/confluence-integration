import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import spaceController from '../../src/controllers/spaces.controller'
import * as getAccessibleResources from '../../src/utils/getAccessibleResources'
import * as getUserSpaces from '../../src/utils/getUserSpaces'
import mockSpaces from '../fixtures/mockspaces'
import mockSite from '../fixtures/mockSite'
import '../../types/session'
import { expectErrorResponse, expectSuccessResponse } from '../helpers/assertResponses'

describe('spaceController.getSpaces', () => {
	let req: Partial<Request>
	let res: Partial<Response>
	let jsonStub: sinon.SinonStub
	let statusStub: sinon.SinonStub
	let redirectStub: sinon.SinonStub

	beforeEach(() => {
		jsonStub = sinon.stub()
		statusStub = sinon.stub().returns({ json: jsonStub } as any)
		redirectStub = sinon.stub()
		req = {
			session: {
				accessToken: undefined,
			} as unknown as Session & Partial<SessionData>,
		}
		res = {
			status: statusStub,
			json: jsonStub,
			redirect: redirectStub,
		}
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should return spaces if everything works', async () => {
		req.session!.accessToken = 'mock-token'

		sinon.stub(getAccessibleResources, 'default').resolves([mockSite])
		sinon.stub(getUserSpaces, 'default').resolves(mockSpaces)

		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })
		res = { status: statusStub } as Partial<Response>

		await spaceController.getSpaces(req as Request, res as Response)

		// Log what was actually returned

		expect(statusStub.calledWith(200)).to.be.true
		expect(jsonStub.calledWithMatch(expectSuccessResponse(mockSpaces))).to.be.true
	})

	it('should return 400 if no accessible site', async () => {
		req.session!.accessToken = 'mock-token'

		sinon.stub(getAccessibleResources, 'default').resolves([])

		await spaceController.getSpaces(req as Request, res as Response)

		expect(statusStub.calledWith(400)).to.be.true
		expect(jsonStub.called).to.be.true
	})

	it('should handle API failure', async () => {
		req.session!.accessToken = 'mock-token'

		sinon.stub(getAccessibleResources, 'default').throws(new Error('boom'))

		await spaceController.getSpaces(req as Request, res as Response)

		expect(statusStub.calledWith(500)).to.be.true
		expect(jsonStub.calledWithMatch(expectErrorResponse)).to.be.true
	})
})

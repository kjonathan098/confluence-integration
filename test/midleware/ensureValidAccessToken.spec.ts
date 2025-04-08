import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import { ensureValidAccessToken } from '../../src/middleware/ensureValidAccessToken'
import * as tokenUtils from '../../src/utils/refreshAccessToken'
import 'express-session'
import { mockTokenResponse } from '../fixtures/mockTokenResponse'
declare module 'express-session' {
	interface SessionData {
		accessToken?: string
		refreshToken?: string
		tokenExpiry?: number
		returnTo?: string
	}
}

describe('ensureValidAccessToken middleware', () => {
	let req: Partial<Request>
	let res: Partial<Response>
	let next: sinon.SinonSpy
	let redirectStub: sinon.SinonStub

	beforeEach(() => {
		redirectStub = sinon.stub()
		next = sinon.spy()
		req = {
			session: {
				accessToken: undefined,
				refreshToken: undefined,
				tokenExpiry: undefined,
			},

			originalUrl: '/some/protected/route',
		} as Partial<Request>
		res = {
			redirect: redirectStub,
		} as Partial<Response>
	})
	afterEach(() => {
		sinon.restore()
	})

	it('should redirect to OAuth if no access token', async () => {
		await ensureValidAccessToken(req as Request, res as Response, next)
		expect(redirectStub.calledWith('/api/oauth/redirect')).to.be.true
		expect(req.session!.returnTo).to.equal('/some/protected/route')
	})

	it('should call next if token is valid and not expired', async () => {
		req.session = {
			accessToken: 'valid-token',
			tokenExpiry: Date.now() + 100000,
		} as any
		await ensureValidAccessToken(req as Request, res as Response, next)
		expect(next.calledOnce).to.be.true
	})

	it('should refresh token if expired and refresh token is present', async () => {
		req.session = {
			accessToken: 'expired-token',
			refreshToken: 'refresh-token',
			tokenExpiry: Date.now() - 1000,
		} as any

		const refreshStub = sinon.stub(tokenUtils, 'refreshAccessToken').resolves(mockTokenResponse)
		await ensureValidAccessToken(req as Request, res as Response, next)
		expect(refreshStub.calledOnce).to.be.true
		expect(req.session!.accessToken).to.equal('mock-access')
		// expect(next.calledOnce).to.be.true
	})

	it('should redirect if refresh fails', async () => {
		req.session = {
			accessToken: 'expired-token',
			refreshToken: 'refresh-token',
			tokenExpiry: Date.now() - 1000,
		} as any
		sinon.stub(tokenUtils, 'refreshAccessToken').rejects(new Error('fail'))
		await ensureValidAccessToken(req as Request, res as Response, next)
		expect(redirectStub.calledWith('/api/oauth/redirect')).to.be.true
	})
})

import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import authController from '../../src/controllers/auth.controller'
import { Request, Response, NextFunction } from 'express'
import * as exchangeCodeForToken from '../../src/utils/exchangeCodeForToken'
import '../../types/session'
import { expectErrorResponse } from '../helpers/assertResponses'
import { buildErrorResponseFormat } from '../../src/utils/respond'
import { mockTokenResponse } from '../fixtures/mockTokenResponse'
import { AppError } from '../../src/utils/appErrorClass'
import { assertNextCalledWithAppError } from '../helpers/assertNextCalledWithAppError'

describe('authController.redirectToAtlassian', () => {
	let res: Partial<Response>
	let redirectStub: SinonStub
	let next: sinon.SinonStub // Declare next as a Sinon stub

	beforeEach(() => {
		process.env.CLIENT_ID = 'test-client-id'
		process.env.REDIRECT_URI = 'http://localhost:3000/callback'
		next = sinon.stub()

		redirectStub = sinon.stub()

		res = {
			redirect: redirectStub,
		}
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should call res.redirect()', () => {
		// Call the controller with a fake request and mocked response
		authController.redirectToAtlassian({} as Request, res as Response, next)

		// Check that res.redirect was called once
		expect((res.redirect as sinon.SinonStub).calledOnce).to.be.true
	})

	it('should redirect to Atlassian OAuth base URL', () => {
		authController.redirectToAtlassian({} as Request, res as Response, next)

		// Grab the redirect URL passed to res.redirect
		const redirectUrl = (res.redirect as sinon.SinonStub).getCall(0).args[0]

		// Ensure the URL starts with Atlassian's authorize endpoint
		expect(redirectUrl).to.include('https://auth.atlassian.com/authorize')
	})

	it('should include correct query parameters', () => {
		//Set dummy env vars so our test is deterministic
		process.env.CLIENT_ID = 'test-client-id'
		process.env.REDIRECT_URI = 'http://localhost:3000/callback'

		authController.redirectToAtlassian({} as Request, res as Response, next)

		// Extract query string from redirect URL
		const redirectUrl = (res.redirect as sinon.SinonStub).getCall(0).args[0]
		const queryParams = new URLSearchParams(redirectUrl.split('?')[1])

		// Validate each key OAuth2 query parameter
		expect(queryParams.get('client_id')).to.equal(process.env.CLIENT_ID)
		expect(queryParams.get('redirect_uri')).to.equal(process.env.REDIRECT_URI)
		expect(queryParams.get('audience')).to.equal('api.atlassian.com')
		expect(queryParams.get('response_type')).to.equal('code')
		expect(queryParams.get('prompt')).to.equal('consent')
	})

	it('should include scopes in the query', () => {
		authController.redirectToAtlassian({} as Request, res as Response, next)

		// Get the scope query param from the redirect URL
		const redirectUrl = (res.redirect as sinon.SinonStub).getCall(0).args[0]
		const queryParams = new URLSearchParams(redirectUrl.split('?')[1])
		const scope = queryParams.get('scope')

		// Check that scope string exists and contains expected values
		expect(scope).to.be.a('string')
		// Replace with actual scope you're using
		expect(scope).to.include('read:confluence-space.summary')
	})

	it('should fail gracefully if client_id is missing', () => {
		// Simulate missing env vars
		delete process.env.CLIENT_ID

		// Stub res.send + res.status

		authController.redirectToAtlassian({} as Request, res as unknown as Response, next)

		assertNextCalledWithAppError(next)
	})
	it('should fail gracefully if redirect_uri is missing', () => {
		delete process.env.REDIRECT_URI

		authController.redirectToAtlassian({} as Request, res as unknown as Response, next)

		it('should fail gracefully if client_id is missing', () => {
			// Simulate missing env vars
			delete process.env.CLIENT_ID

			// Stub res.send + res.status

			authController.redirectToAtlassian({} as Request, res as unknown as Response, next)

			assertNextCalledWithAppError(next)
		})
	})
})

describe('authController.handleOauthCallback', () => {
	let req
	let next: sinon.SinonStub

	beforeEach(() => {
		next = sinon.stub()
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should redirect to /api/spaces on successful token exchange', async () => {
		// Stub the token exchange utility
		sinon.stub(exchangeCodeForToken, 'exchangeCodeForToken').resolves(mockTokenResponse)

		// Stub the redirect
		const redirectStub = sinon.stub()

		const req = {
			query: { code: 'mock-code' },
			session: {} as any,
		}

		const res = { redirect: redirectStub }

		const next = sinon.stub()

		await authController.handleOauthCallback(req as unknown as Request, res as unknown as Response, next)

		expect(redirectStub.calledOnceWith('/api/spaces')).to.be.true
	})

	it('should call next with AppError if code is missing', async () => {
		const req = { query: {} }
		const res = {}

		await authController.handleOauthCallback(req as Request, res as unknown as Response, next)

		assertNextCalledWithAppError(next)
	})

	it('should call next if exchangeCodeForToken fails', async () => {
		// This simulates a failed token exchange

		sinon.stub(exchangeCodeForToken, 'exchangeCodeForToken').rejects(new AppError('mock-message', 400))

		const req = { query: { code: 'mock-code' }, session: {} }
		const res = {}

		await authController.handleOauthCallback(req as unknown as Request, res as unknown as Response, next)
		assertNextCalledWithAppError(next)
	})
})

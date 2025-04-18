import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import authController from '../../src/controllers/auth.controller'
import { Request, Response } from 'express'
import * as exchangeCodeForToken from '../../src/utils/exchangeCodeForToken'
import '../../types/session'
import { expectErrorResponse } from '../helpers/assertResponses'
import { buildErrorResponseFormat } from '../../src/utils/respond'
import { mockTokenResponse } from '../fixtures/mockTokenResponse'

describe('authController.redirectToAtlassian', () => {
	let res: Partial<Response>
	let redirectStub: SinonStub
	beforeEach(() => {
		process.env.CLIENT_ID = 'test-client-id'
		process.env.REDIRECT_URI = 'http://localhost:3000/callback'

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
		authController.redirectToAtlassian({} as Request, res as Response)

		// Check that res.redirect was called once
		expect((res.redirect as sinon.SinonStub).calledOnce).to.be.true
	})

	it('should redirect to Atlassian OAuth base URL', () => {
		authController.redirectToAtlassian({} as Request, res as Response)

		// Grab the redirect URL passed to res.redirect
		const redirectUrl = (res.redirect as sinon.SinonStub).getCall(0).args[0]

		// Ensure the URL starts with Atlassian's authorize endpoint
		expect(redirectUrl).to.include('https://auth.atlassian.com/authorize')
	})

	it('should include correct query parameters', () => {
		//Set dummy env vars so our test is deterministic
		process.env.CLIENT_ID = 'test-client-id'
		process.env.REDIRECT_URI = 'http://localhost:3000/callback'

		authController.redirectToAtlassian({} as Request, res as Response)

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
		authController.redirectToAtlassian({} as Request, res as Response)

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
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		const res = {
			status: statusStub,
		}

		authController.redirectToAtlassian({} as Request, res as unknown as Response)

		expect(jsonStub.calledWithMatch(expectErrorResponse)).to.be.true
	})
	it('should fail gracefully if redirect_uri is missing', () => {
		delete process.env.REDIRECT_URI
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		const res = {
			status: statusStub,
		}

		authController.redirectToAtlassian({} as Request, res as unknown as Response)

		expect(jsonStub.calledWithMatch(expectErrorResponse)).to.be.true
	})
})

describe('authController.handleOauthCallback', () => {
	let req

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

		await authController.handleOauthCallback(req as unknown as Request, res as unknown as Response)

		expect(redirectStub.calledOnceWith('/api/spaces')).to.be.true
	})

	it('should return 400 if code is missing', async () => {
		// Stub res.send + res.status
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		req = { query: {} }
		const res = { status: statusStub }

		await authController.handleOauthCallback(req as Request, res as unknown as Response)
		expect(
			jsonStub.calledWithMatch({
				success: false,
				message: sinon.match.string,
			})
		).to.be.true
	})

	it('should respond with global error if exchangeCodeForToken fails', async () => {
		// This simulates a failed token exchange
		sinon.stub(exchangeCodeForToken, 'exchangeCodeForToken').rejects(new Error(buildErrorResponseFormat('Failed to exchange authorization code for access token')))

		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		const req = { query: { code: 'mock-code' }, session: {} }
		const res = { status: statusStub }

		await authController.handleOauthCallback(req as unknown as Request, res as unknown as Response)

		expect(statusStub.calledWith(500)).to.be.true

		const [actualError] = jsonStub.firstCall.args
		expect(actualError).to.deep.equal({
			success: false,
			message: 'Failed to exchange code for token',
		})
	})
})

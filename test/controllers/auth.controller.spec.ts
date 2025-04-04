import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import authController from '../../src/controllers/auth.controller'
import { Request, Response } from 'express'
import * as oauthUtils from '../../src/utils/oauth'
import '../../types/session' // ✅ now it's a real importable module

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
		expect(scope).to.include('read:confluence-space.summary') // Replace with actual scope you're using
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

		expect(
			jsonStub.calledWithMatch({
				success: false,
				message: sinon.match.string,
			})
		).to.be.true
	})
	it('should fail gracefully if redirect_uri is missing', () => {
		delete process.env.REDIRECT_URI
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		const res = {
			status: statusStub,
		}

		authController.redirectToAtlassian({} as Request, res as unknown as Response)

		expect(
			jsonStub.calledWithMatch({
				success: false,
				message: sinon.match.string,
			})
		).to.be.true
	})
})

describe('authController.handleOauthCallback', () => {
	let req, res

	afterEach(() => {
		sinon.restore()
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

	it('should return 200 and token data on success', async () => {
		sinon.stub(oauthUtils, 'exchangeCodeForToken').resolves({
			access_token: 'mock-access',
			refresh_token: 'mock-refresh',
			expires_in: 3600,
			message: 'OAuth flow completed!',
		})

		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ success: true, json: jsonStub })

		let req: Partial<Request>
		req = {
			query: { code: 'mock-code' },
			session: {
				accessToken: 'abc',
			} as any,
		}
		res = { status: statusStub }

		await authController.handleOauthCallback(req as Request, res as unknown as Response)

		expect(
			jsonStub.calledWithMatch({
				success: true,
				data: {
					message: 'OAuth flow completed!',
				},
			})
		).to.be.true
	})

	it('should throw 500 error if token exchange fails', async () => {
		sinon.stub(oauthUtils, 'exchangeCodeForToken').rejects(new Error('boom'))
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		const req: Partial<Request> = { query: { code: 'mock-code' } }
		const res = { status: statusStub }

		try {
			await authController.handleOauthCallback(req as Request, res as unknown as Response)
			throw new Error('Expected error not thrown')
		} catch (err) {
			expect(err).to.deep.equal({
				status: 500,
				message: 'Failed to exchange code for token',
			})
		}
	})
})

import { expect } from 'chai'
import sinon from 'sinon'
import { Response } from 'express'
import * as respondModule from '../../src/utils/respond'
import { handleAxiosError } from '../../src/utils/handleAxiosErrrors'

describe('handleAxiosError', () => {
	let res: Partial<Response>
	let respondErrorStub: sinon.SinonStub
	let consoleErrorStub: sinon.SinonStub

	beforeEach(() => {
		res = {
			status: sinon.stub().returnsThis(),
			json: sinon.stub(),
		}
		respondErrorStub = sinon.stub(respondModule, 'respondError')
		consoleErrorStub = sinon.stub(console, 'error')
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should handle an Axios-style error with response data', () => {
		const error = {
			response: {
				status: 404,
				data: {
					message: 'Page not found',
				},
			},
			message: 'Fallback message',
		}

		handleAxiosError(res as Response, error as any, 'Failed to fetch page')

		expect(consoleErrorStub.calledOnce).to.be.true
		expect(respondErrorStub.calledWith(res, 'Page not found', 404)).to.be.true
	})

	it('should handle error with no response object', () => {
		const error = {
			message: 'Network error',
		}

		handleAxiosError(res as Response, error as any, 'Could not connect')

		expect(consoleErrorStub.calledOnce).to.be.true
		expect(respondErrorStub.calledWith(res, 'Network error', 500)).to.be.true
	})

	it('should fallback to default message if no message is provided', () => {
		const error = {}

		handleAxiosError(res as Response, error as any, 'Default message here')

		expect(consoleErrorStub.calledOnce).to.be.true
		expect(respondErrorStub.calledWith(res, 'An unexpected error occurred: Default message here', 500)).to.be.true
	})
})

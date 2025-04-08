import { expect } from 'chai'
import { SinonStub } from 'sinon'
import { AppError } from '../../src/utils/appErrorClass'

export const assertNextCalledWithAppError = (next: SinonStub) => {
	// Ensure next was called once
	expect(next.calledOnce).to.be.true

	// Get the error passed to next
	const error = next.firstCall.args[0]

	// Assert that the error is an instance of AppError
	expect(error).to.be.instanceOf(AppError)

	// Assert that the error has the correct properties
	expect(error).to.have.property('message').to.be.a('string')
	expect(error).to.have.property('status').to.be.a('number')
}

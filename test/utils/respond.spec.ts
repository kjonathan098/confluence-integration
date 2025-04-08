import { expect } from 'chai'
import sinon from 'sinon'
import { respondSuccess } from '../../src/utils/respond'
import { Response } from 'express'

describe('respondSuccess', () => {
	it('should call res.status and res.json with correct data', () => {
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })

		const res = { status: statusStub } as unknown as Response

		const data = { message: 'OK' }

		respondSuccess(res, data, 201)

		expect(statusStub.calledWith(201)).to.be.true
		expect(
			jsonStub.calledWithMatch({
				success: true,
				data,
			})
		).to.be.true
	})
	it('should default to 200 if no status is provided', () => {
		const jsonStub = sinon.stub()
		const statusStub = sinon.stub().returns({ json: jsonStub })
		const res = { status: statusStub } as unknown as Response

		const data = { msg: 'hello' }

		respondSuccess(res, data)

		expect(statusStub.calledWith(200)).to.be.true
		expect(jsonStub.calledWithMatch({ success: true, data })).to.be.true
	})
})

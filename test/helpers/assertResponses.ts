import sinon from 'sinon'

export const expectErrorResponse = { success: false, message: sinon.match.string }

export const expectSuccessResponse = (data?: any) => ({
	success: true,
	data: data !== undefined ? data : sinon.match.any,
})

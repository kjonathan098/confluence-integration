export type ErrorResponse = {
	success: false
	message: string
}

export type SuccessResponse<T = any> = {
	success: true
	data: T
}

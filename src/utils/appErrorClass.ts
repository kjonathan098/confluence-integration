export class AppError extends Error {
	status: number
	success: boolean

	constructor(message: string, status: number = 500) {
		super(message)
		this.status = status
		this.success = false
	}
}

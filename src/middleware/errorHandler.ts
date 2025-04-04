import { Request, Response, NextFunction } from 'express'
import { respondError } from '../utils/respond'
interface ErrorResponse {
	status: number
	message: string
}
const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
	console.error(err.message)

	const status = err.status || 500
	const message = err.message || 'Internal Server Error'
	respondError(res, message, status)
}

export default errorHandler

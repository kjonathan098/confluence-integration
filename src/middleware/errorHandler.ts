import { Request, Response, NextFunction } from 'express'
import { respondError } from '../utils/respond'
interface ErrorResponse {
	status: number
	message: string
	success: false
}
const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
	console.log(err)
	res.status(err.status).json({ success: err.success, message: err.message })
}

export default errorHandler

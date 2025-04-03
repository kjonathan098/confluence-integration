import { Request, Response, NextFunction } from 'express'
interface ErrorResponse {
	status: number
	message: string
}

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
	console.error(err.message)

	res.status(err.status || 500).json({
		error: {
			message: err.message || 'Internal Server Error',
		},
	})
}

export default errorHandler

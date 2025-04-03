import { Response } from 'express'

export const sendResponse = (res: Response, status: number, data: any, message: string = 'Request successful') => {
	return res.status(status).json({
		status,
		message,
		data,
	})
}

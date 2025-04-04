import { Response } from 'express'

export function respondSuccess(res: Response, data: any, status: number = 200) {
	return res.status(status).json({
		success: true,
		data,
	})
}

export function respondError(res: Response, message: string, status = 500) {
	return res.status(status).json({
		success: false,
		message,
	})
}

import { Response } from 'express'

export function respondSuccess(res: Response, data: any, status: number = 200) {
	return res.status(status).json({
		success: true,
		data,
	})
}

export function respondError(res: Response, message: string, status = 500) {
	return res.status(status).json(buildErrorResponseObject(message))
}

/**
 - Returns a stringified version of the error response, used in helper functions that throw errors but dont have res functionailty .
 - Matches the structure used in respondError().
 */
export function buildErrorResponseFormat(message: string) {
	return JSON.stringify(buildErrorResponseObject(message))
}

/*
 - Builds the standard error response object structure.
 - Centralized so we can update structure in one place.
 */
export function buildErrorResponseObject(message: string) {
	return {
		success: false,
		message,
	}
}

import { Response } from 'express'
import { respondError } from './respond'

export function handleAxiosError(res: Response, error: any, defaultMsg: string) {
	console.error(defaultMsg, error.response?.data || error.message || error)

	const message = error.response?.data?.message || error.message || `An unexpected error occurred: ${defaultMsg}`

	const status = error.response?.status || 500

	respondError(res, message, status)
}

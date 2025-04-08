import { NextFunction, Request, Response } from 'express'
import getAccessibleResources from '../utils/getAccessibleResources'
import getUserSpaces from '../utils/getUserSpaces'
import { respondError, respondSuccess } from '../utils/respond'
import { AppError } from '../utils/appErrorClass'

const getSpaces = async (req: Request, res: Response, next: NextFunction) => {
	const access_token = req.session.accessToken!

	try {
		// Get cloudId from Atlassian
		const accessibleRes = await getAccessibleResources(access_token)
		const site = accessibleRes[0] // For this exercise, we only use the first accessible site

		if (!site) {
			return next(new AppError('No accessible Confluence sites found', 404))
		}

		const cloudId = site.id

		const spaces = await getUserSpaces(access_token, cloudId)

		respondSuccess(res, spaces, 200)
	} catch (err: any) {
		console.error('Error:', err.response?.data || err.message)
		return next(new AppError(err.message || 'Error fetching spaces', err.status))
	}
}

/* this is so test coverage ignore this function  */
// istanbul ignore next
const getSpacesPostman = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.query.token as string

	if (!accessToken) {
		return next(new AppError('access token not in query', 400))
	}

	try {
		// STEP 1: Get cloudId from Atlassian
		const accessibleRes = await getAccessibleResources(accessToken)
		const site = accessibleRes[0]

		if (!site) {
			return next(new AppError('No accessible Confluence sites found', 404))
		}

		const cloudId = site.id

		const spaces = await getUserSpaces(accessToken, cloudId)

		//TODO USE GLOBBAL RESPOSNE
		respondSuccess(res, spaces, 200)
		return
	} catch (err: any) {
		console.error('Error:', err.response?.data || err.message)
		return next(new AppError(err.message || 'Error fetching spaces', err.status))
	}
}

const spaceController = { getSpaces, getSpacesPostman }
export default spaceController

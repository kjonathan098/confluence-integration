import axios from 'axios'
import express, { Request, Response } from 'express'
import { AccessibleResource } from '../../types/confluence'

const getSpaces = async (req: Request, res: Response) => {
	// check if user is already logged in if not send them to confluence oath
	res.send(req.session.accessToken)
}

const getSpacesPostman = async (req: Request, res: Response) => {
	const accessToken = req.query.token as string

	if (!accessToken) {
		res.status(400).json({ message: 'Missing token in query param ?token=...' })
		return
	}

	try {
		// STEP 1: Get cloudId from Atlassian
		const accessibleRes = await axios.get<AccessibleResource[]>('https://api.atlassian.com/oauth/token/accessible-resources', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		})
		console.log(accessibleRes.data)
		res.send(accessibleRes.data)
		return
	} catch (err: any) {
		console.error('❌ Error:', err.response?.data || err.message)
		res.status(500).json({ message: 'Error fetching spaces', error: err.response?.data || err.message })
	}
}

const spaceController = { getSpaces, getSpacesPostman }
export default spaceController

/*


const getSpacesPostman = async (req: Request, res: Response) => {
	const accessToken = req.query.token as string

	if (!accessToken) {
		res.status(400).json({ message: 'Missing token in query param ?token=...' })
		return
	}

	try {
		// STEP 1: Get cloudId from Atlassian
		const accessibleRes = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		})
		console.log(accessibleRes.data)
		res.send(accessibleRes.data)
		return
		const site = accessibleRes.data?.[0]

		if (!site) {
			res.status(404).json({ message: 'No accessible Confluence site found' })
			return
		}

		const cloudId = site.id

		// STEP 2: Fetch spaces
		const spacesRes = await axios.get(`https://api.atlassian.com/ex/confluence/${cloudId}/wiki/rest/api/space`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		})

		res.status(200).json(spacesRes.data)
		return
	} catch (err: any) {
		console.error('❌ Error:', err.response?.data || err.message)
		res.status(500).json({ message: 'Error fetching spaces', error: err.response?.data || err.message })
	}
}

*/

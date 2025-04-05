import axios from 'axios'
import express, { Request, Response } from 'express'

const getSpaces = async (req: Request, res: Response) => {
	// check if user is already logged in if not send them to confluence oath
	console.log('hi there ')
	res.send('hi')

	// try {
	// 	// Step 1: Get list of accessible Confluence cloud instances
	// 	const siteRes = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
	// 		headers: {
	// 			Authorization: `Bearer ${accessToken}`,
	// 			Accept: 'application/json',
	// 		},
	// 	})
	// 	const sites = siteRes.data
	// 	if (!sites.length) {
	// 		return res.status(404).json({ message: 'No Confluence sites found for this user.' })
	// 	}
	// 	// For this assignment, let’s just use the first one
	// 	const confluenceSite = sites.find((s: any) => s.name.includes('Confluence')) || sites[0]
	// 	const cloudId = confluenceSite.id
	// 	// Step 2: Fetch spaces in that site
	// 	const spacesRes = await axios.get(`https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/spaces`, {
	// 		headers: {
	// 			Authorization: `Bearer ${accessToken}`,
	// 			Accept: 'application/json',
	// 		},
	// 	})
	// 	const spaces = spacesRes.data.results.map((space: any) => ({
	// 		id: space.id,
	// 		key: space.key,
	// 		name: space.name,
	// 	}))
	// 	// Optional: store in session
	// 	// req.session.spaces = spaces
	// 	res.status(200).json(spaces)
	// } catch (error: any) {
	// 	console.error('Failed to fetch spaces:', error.response?.data || error.message)
	// 	res.status(500).json({ message: 'Failed to retrieve Confluence spaces.' })
	// }
}

const spaceController = { getSpaces }
export default spaceController

import express from 'express'
import authController from '../controllers/auth.controller'
import { Response, Request } from 'express'

const spacesRouter = express.Router()

spacesRouter.get('/spaces/:spaceKey/pages', async (req: Request, res: Response) => {
	const { spaceKey } = req.params

	// try {
	// 	const pages = await getPagesInSpace(spaceKey)
	// 	res.status(200).json(pages)
	// } catch (error: any) {
	// 	console.error('Error fetching pages:', error)
	// 	res.status(500).json({ message: 'Failed to fetch pages', error: error.message })
	// }
})

export default spacesRouter

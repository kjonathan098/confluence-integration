import { Request, Response, NextFunction } from 'express'

// make sure users have a session where we can access auth token
const verifyUserInSession = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.session?.accessToken
	if (!accessToken) {
		// Not authenticated yet – redirect to OAuth login
		res.redirect('/api/oauth/redirect')
		return
	}
	next()
}

export default verifyUserInSession

import dotenv from 'dotenv'
import express from 'express'
import authRouter from './routes/auth.route'
import errorHandler from './middleware/errorHandler'
import session from 'express-session'
import spacesRouter from './routes/spaces.route'
import pagesRouter from './routes/pages.route'
import pageContentRouter from './routes/pageContent.routes'
dotenv.config()

declare module 'express-session' {
	interface SessionData {
		accessToken?: string
		redirectAfterLogin?: string
		refreshToken?: string
		returnTo?: string
		tokenExpiry?: number
	}
}
const port = 3000

const app = express()

app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
)

app.use('/api/oauth', authRouter)
app.use('/api/spaces', spacesRouter)
app.use('/api/pages', pagesRouter)
app.use('/api/pageContent', pageContentRouter)

app.use(errorHandler)

app.listen(port, () => {
	console.log(`now listening on port ${port}`)
})

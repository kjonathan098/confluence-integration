import 'express-session'

declare module 'express-session' {
	interface SessionData {
		accessToken?: string
		refreshToken?: string
		tokenExpiry?: number
		redirectAfterLogin?: string
		returnTo?: string
	}
}

export {}

import 'express-session'

declare module 'express-session' {
	interface SessionData {
		accessToken?: string
		redirectAfterLogin?: string
		returnTo?: string
	}
}

// 👇 this is key
export {}

import 'express-session'

declare module 'express-session' {
	interface SessionData {
		accessToken?: string
		redirectAfterLogin?: string
	}
}

// 👇 this is key
export {}

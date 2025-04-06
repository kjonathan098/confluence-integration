import { Session, SessionData } from 'express-session'

export const createMockSession = (data: Partial<SessionData> = {}): Session & Partial<SessionData> => {
	return {
		id: 'mock-session-id',
		cookie: {} as any,
		regenerate: () => {} as any,
		destroy: () => {} as any,
		reload: () => {} as any,
		save: () => {} as any,
		touch: () => {} as any,
		resetMaxAge: () => {} as any,
		...data,
	}
}

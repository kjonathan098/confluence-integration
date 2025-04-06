import { ConfluencePage, ConfluencePagesResponse } from '../../types/confluence'

export const mockPage: ConfluencePage = {
	id: 'mock-id',
	title: 'mock-title',
	type: 'mock-type',
	status: 'mock-status',
	body: {
		storage: {
			value: 'mock-value',
			representation: 'mock-representation',
		},
	},
	_links: {
		self: 'mock-self',
		webui: 'mock-webi',
	},
}

export const mockPagesResponse: ConfluencePagesResponse = {
	results: [mockPage],
	start: 0,
	limit: 25,
	size: 1,
	_links: {
		base: 'mock-base',
		context: 'mock-context',
		self: 'mock-self',
	},
}

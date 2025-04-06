export interface AccessibleResource {
	id: string
	url: string
	name: string
	scopes: string[]
	avatarUrl: string
}

export interface ConfluenceSpace {
	id: number
	key: string
	alias: string
	name: string
	type: string
	status: string
	_links: {
		webui: string
		self: string
	}
	_expandable: {
		settings: string
		metadata: string
		identifiers: string
		roles: string
		icon: string
		typeSettings: string
		description: string
		history: string
		operations: string
		lookAndFeel: string
		permissions: string
		theme: string
		homepage: string
	}
}

export interface ConfluenceSpacesResponse {
	results: ConfluenceSpace[]
	start: number
	limit: number
	size: number
	_links: {
		base: string
		context: string
		self: string
	}
}

export interface ConfluencePage {
	id: string
	title: string
	type: string
	status: string
	body?: {
		storage?: {
			value: string
			representation: string
		}
	}
	_links: {
		self: string
		webui: string
	}
}

export interface ConfluencePagesResponse {
	results: ConfluencePage[]
	start: number
	limit: number
	size: number
	_links: {
		base: string
		context: string
		self: string
	}
}

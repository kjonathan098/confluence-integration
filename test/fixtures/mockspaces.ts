const mockSpaces = {
	results: [
		{
			id: 123,
			key: 'TEST',
			alias: 'TEST',
			name: 'Test Space',
			type: 'global',
			status: 'current',
			_expandable: {
				settings: '/rest/api/space/TEST/settings',
				metadata: '',
				identifiers: '',
				roles: '',
				icon: '',
				typeSettings: '',
				description: '',
				history: '',
				operations: '',
				lookAndFeel: '/rest/api/settings/lookandfeel?spaceKey=TEST',
				permissions: '',
				theme: '/rest/api/space/TEST/theme',
				homepage: '/rest/api/content/123456',
			},
			_links: {
				webui: '/spaces/TEST',
				self: 'https://mock.atlassian.net/wiki/rest/api/space/TEST',
			},
		},
	],
	start: 0,
	limit: 25,
	size: 1,
	_links: {
		base: 'https://mock.atlassian.net/wiki',
		context: '/wiki',
		self: 'https://mock.atlassian.net/wiki/rest/api/space',
	},
}

export default mockSpaces

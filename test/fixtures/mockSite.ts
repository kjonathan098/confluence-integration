import { AccessibleResource } from '../../types/confluence'

const mockSite: AccessibleResource = {
	id: 'site-id',
	url: 'https://mock-site.atlassian.net',
	name: 'Mock Site',
	scopes: ['read:confluence-space.summary'],
	avatarUrl: 'https://mock-avatar.url',
}

export default mockSite

# Confluence Integration

This project implements a Confluence integration that enables a third party to access user's Space/Page/PageContent to interact with Atlassian's Confluence API. 
It supports OAuth2 authentication,listin all spaces,  listing pages within a space, and fetching specific page content.

## Features

- OAuth2 Authentication with Atlassian
- List all pages in a Confluence space
- Get the content of a specific Confluence page
- Middleware for access token validation and refresh
- 100% Test Coverage (Mocha + Chai)
- Modular, typed, and fully tested codebase
- Graceful error handling with custom utilities

## Tech Stack

- TypeScript + Node.js
- Express.js
- Mocha + Chai + Sinon for testing
- Axios for API requests
- Express-session for session management

## Setup Instructions

1. **Clone the repo and install dependencies**

```bash
git clone https://github.com/YOUR_USERNAME/confluence-integration.git
cd confluence-integration
```
```bash
npm install
```

2. **Create .env file and add this vars**
- CLIENT_ID=your-atlassian-client-id
- CLIENT_SECRET=your-atlassian-client-secret
- REDIRECT_URI=http://localhost:3000/api/oauth/callback
- SESSION_SECRET=a-random-secret-key-for-session

3. **Start Server**
npm run dev

4. **Run Tests**
npm run test

## Accessing Endpoints
Once the server is running, you can access the following endpoints:

## OAuth Redirect:
Navigate to initiate the OAuth authentication flow
http://localhost:3000/api/oauth/redirect 

## List User's  Spaces:
Get a list of user's spaces :
http://localhost:3000/api/spaces

## List Pages in Space:
Access a specific space's page listing by going to:
http://localhost:3000/api/pages/{space-id}/{space-key}

For example: 
http://localhost:3000/api/pages/a1b452fa-f7ad-4b7f-8715-8ba5c2fa0a6b/AWT

## Get Page Content:
Fetch content for a specific page by navigating to:
http://localhost:3000/api/pageContent/{space-id}/{page-id}?format=html

For example:
http://localhost:3000/api/pageContent/a1b452fa-f7ad-4b7f-8715-8ba5c2fa0a6b/557306?format=html

or json format
http://localhost:3000/api/pageContent/a1b452fa-f7ad-4b7f-8715-8ba5c2fa0a6b/557306?

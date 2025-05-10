# Portal Backend

A backend service for a portal application that integrates with Casdoor for authentication using OIDC protocol.

## Features

- Casdoor authentication integration with OIDC protocol
- Portal service management (LobeChat, NewAPI, and custom services)
- Secure API endpoints with JWT authentication
- Easy configuration through environment variables

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Casdoor server instance with a configured application

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd portal-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the values in the `.env` file with your Casdoor configuration

## Configuration

Update the `.env` file with your Casdoor configuration:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Casdoor Configuration
CASDOOR_ENDPOINT=https://your-casdoor-server.com
CASDOOR_CLIENT_ID=your-client-id
CASDOOR_CLIENT_SECRET=your-client-secret
CASDOOR_ORG_NAME=your-org-name
CASDOOR_APP_NAME=portal

# Callback URL
CALLBACK_URL=http://localhost:3000/api/auth/callback

# Services
LOBE_CHAT_URL=https://your-lobechat-url.com
NEWAPI_URL=https://your-newapi-url.com
```

Also, update the certificate in `src/config/cert.js` with your Casdoor application's certificate.

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- `GET /api/auth/callback`: Handle the callback from Casdoor
- `GET /api/auth/user`: Get the current user's information (requires authentication)

### Portal Services

- `GET /api/portal/services`: Get all services (public)
- `POST /api/portal/services`: Add a new service (requires authentication)
- `PUT /api/portal/services/:id`: Update a service (requires authentication)
- `DELETE /api/portal/services/:id`: Delete a service (requires authentication)

## Authentication Flow

1. Frontend redirects to Casdoor login page
2. User logs in on Casdoor
3. Casdoor redirects back to the callback URL with an authorization code
4. Backend exchanges the code for an access token
5. Frontend stores the token and uses it for authenticated requests

## Adding a New Service

To add a new service to the portal, make a POST request to `/api/portal/services` with the following JSON body:

```json
{
  "id": "service-id",
  "name": "Service Name",
  "description": "Service Description",
  "url": "https://service-url.com",
  "icon": "service-icon"
}
```

## License

[MIT](LICENSE)

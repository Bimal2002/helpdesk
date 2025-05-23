# Helpdesk Server API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login and register) require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Project Structure
```
server/
├── config/            # Configuration files
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Mongoose models
├── routes/           # API routes
└── utils/            # Utility functions
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```
Request body:
```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "customer"
}
```
Note: Only customer role is allowed through registration. Agents and admins must be created through admin panel or direct API calls.
```

#### Login
```http
POST /auth/login
```
Request body:
```json
{
    "email": "string",
    "password": "string"
}
```

### Tickets

#### Get All Tickets
```http
GET /tickets
```
- Returns all tickets for admin/agent
- Returns only customer's tickets for customers

#### Get Single Ticket
```http
GET /tickets/:id
```
- Returns ticket details with populated customer, assigned agent, notes, and comments

#### Create Ticket
```http
POST /tickets
```
Request body:
```json
{
    "title": "string",
    "description": "string"
}
```


#### Update Ticket Status
```http
PUT /tickets/:id/status
```
Request body:
```json
{
    "status": "active|pending|closed"
}
```
- Requires agent or admin role

#### Add Note to Ticket
```http
POST /tickets/:id/notes
```
Request body:
```json
{
    "content": "string"
}
```

#### Add Comment to Ticket
```http
POST /tickets/:id/comments
```
Request body:
```json
{
    "text": "string"
}
```

#### Assign Ticket to Agent
```http
PUT /tickets/:id/assign
```
Request body:
```json
{
    "agentId": "string"
}
```
- Requires admin role

### Users

#### Get All Agents
```http
GET /users/agents
```
- Returns list of all agents
- Requires admin role

#### Create User (Admin only)
```http
POST /users
```
Request body:
```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "customer|agent|admin"
}
```

## User Creation Rules

### Customer Registration
- Customers can register themselves through the frontend application
- Registration endpoint: `POST /api/auth/register`
- Role must be set to "customer"

### Agent and Admin Creation
- Agents and Admins can ONLY be created through:
  1. Backend API requests (using Postman or similar tools)
  2. Direct database operations
  3. Admin panel (if implemented)
- Regular registration endpoint will reject requests with agent/admin roles
- Required permissions:
  - Agent creation: Admin role required
  - Admin creation: Super admin or direct database access required

### Example Agent Creation (via Postman)
```http
POST /api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "name": "Agent Name",
    "email": "agent@example.com",
    "password": "agent123",
    "role": "agent"
}
```

### Example Admin Creation (via Postman)
```http
POST /api/users
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
}
```

## Response Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Data Models

### Ticket
```typescript
{
    _id: string;
    title: string;
    description: string;
    status: 'active' | 'pending' | 'closed';
    customer: User;
    assignedTo?: User;
    notes: Note[];
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
}
```

### Note
```typescript
{
    content: string;
    author: User;
    attachments?: Attachment[];
    createdAt: Date;
}
```

### Comment
```typescript
{
    text: string;
    author: User;
    timestamp: Date;
}
```

### User
```typescript
{
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'agent' | 'admin';
}
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Setup Instructions

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Security Notes
- Agent and admin accounts should be created with strong passwords
- Admin accounts should be limited and monitored
- Regular audits of admin/agent accounts should be performed
- Password rotation policies should be enforced for admin/agent accounts #   h e l p d e s k b a c k e n d  
 
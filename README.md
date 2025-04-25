# Helpdesk Web Application 🛠️

A MERN stack based Helpdesk application that allows customers to submit support tickets and agents to manage them.



## Features ✨

### User Roles
- **Customer** - Submit and track support tickets
- **Customer Service Agent** - Manage and resolve tickets
- **Admin** - Full system access and user management

### Core Functionality
- 🎫 Ticket Management System
- 👥 Customer Management
- 🔄 Real-time Updates
- 📎 File Attachments
- 📊 Dashboard with Analytics

## Tech Stack 💻

| Component       | Technology |
|-----------------|------------|
| Database        | MongoDB    |
| Backend         | Express.js |
| Frontend        | React.js   |
| Authentication  | JWT        |
| UI Components   | Material-UI|

---
## Project Structure 📂


## Getting Started 🚀

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm v8+

### Installation
1. Clone repository:
```bash
git clone https://github.com/yourusername/helpdesk.git
cd helpdesk

### Install dependencies:
# Server
cd server && npm install

# Client
cd ../client && npm install


3. Create a `.env` file in the server directory:

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

4. Start the development servers:
Start backend server
cd server
npm run dev

Start frontend server
cd client
npm start



```
---
# Helpdesk Ticketing System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login and register) require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
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
    "role": "customer|agent|admin"
}
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
    "email": "agent@gmail.com",
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
    "email": "admin@gmail.com",
    "password": "admin123",
    "role": "admin"
}
```

### Security Notes
- Agent and admin accounts should be created with strong passwords
- Admin accounts should be limited and monitored
- Regular audits of admin/agent accounts should be performed
- Password rotation policies should be enforced for admin/agent accounts


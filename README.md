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

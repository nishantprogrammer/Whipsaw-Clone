# Whipsaw Clone

A full-stack web application clone featuring a modern portfolio website with blog functionality, contact forms, and admin panel.

## Features

- **Frontend**: React-based portfolio with sections for home, about, work, expertise, blog, and contact
- **Backend**: Node.js/Express API with MongoDB
- **Admin Panel**: Secure admin login for managing blogs and portfolio projects
- **Blog System**: Create, read, update, delete blog posts
- **Contact Form**: Send emails via Nodemailer
- **File Uploads**: Image uploads with Sharp for optimization
- **Authentication**: JWT-based authentication
- **Rate Limiting**: API rate limiting for security
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT for authentication
- Nodemailer for emails
- Multer for file uploads
- Sharp for image processing
- Bcrypt for password hashing

## Live Demo

Frontend: [Deployed URL]
Backend API: [Deployed API URL]

## Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/nishantprogrammer/Whipsaw-Clone.git
   cd Whipsaw-Clone
   ```

2. Setup Backend:
   ```bash
   cd whipsaw-clone-backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. Setup Frontend (new terminal):
   ```bash
   cd whipsaw-clone-frontend
   npm install
   npm run dev
   ```

### Environment Variables (Backend)

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com
CORS_ORIGIN=http://localhost:5173  # For production, use your deployed frontend URL
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment

### Backend (Render)
1. Connect GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables in Render dashboard

### Frontend (Vercel/Netlify)
1. Connect GitHub repo to deployment platform
2. Update API base URL in `api.js`
3. Deploy

## API Documentation

### Authentication
- `POST /api/auth/login` - Admin login

### Blogs
- `GET /api/posts` - Get all blog posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin)

### Contact
- `POST /api/contact` - Send contact email

### Health Check
- `GET /api/health` - API health status

## Project Structure

```
Whipsaw-Clone/
├── whipsaw-clone-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── scripts/
│   ├── uploads/
│   ├── package.json
│   ├── server.js
│   └── .env
└── whipsaw-clone-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   ├── home/
    │   │   └── layout/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Coursell - Modern Learning Platform

A comprehensive online learning platform built with React, TypeScript, Node.js, and MongoDB. Coursell provides a modern, scalable solution for course creation, management, and learning.

## 🚀 Features

### For Students
- **Browse Courses**: Discover courses across multiple categories
- **Course Details**: View comprehensive course information with ratings and reviews
- **Purchase System**: Secure course enrollment with payment processing
- **Learning Dashboard**: Track progress and access purchased courses
- **User Profiles**: Manage personal information and learning preferences
- **Responsive Design**: Seamless experience across all devices

### For Instructors/Admins
- **Course Management**: Create, edit, and delete courses with rich content
- **Video Management**: Add, organize, and manage course videos
- **Admin Dashboard**: Comprehensive analytics and course overview
- **User Management**: Monitor student enrollments and progress
- **Content Publishing**: Control course visibility and publication status

### Technical Features
- **Modern UI/UX**: Built with Chakra UI for consistent, beautiful design
- **TypeScript**: Full type safety across the entire application
- **Responsive Design**: Mobile-first approach with excellent cross-device compatibility
- **Authentication**: Secure JWT-based authentication for users and admins
- **API Security**: Rate limiting, input validation, and security headers
- **Database**: MongoDB with Mongoose for flexible data modeling
- **Real-time Updates**: Toast notifications and loading states

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Chakra UI** - Component library for consistent design
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **Winston** - Logging
- **Express Rate Limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
coursell/
├── coursell-be/                 # Backend API
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   ├── validators/              # Input validation
│   ├── index.js                 # Server entry point
│   └── package.json
├── coursell-fe/                 # Frontend application
│   └── course-frontend/
│       ├── src/
│       │   ├── components/      # Reusable components
│       │   ├── pages/           # Page components
│       │   ├── context/         # React context
│       │   ├── services/        # API services
│       │   ├── styles/          # Global styles
│       │   ├── theme.ts         # Chakra UI theme
│       │   └── App.tsx          # Main app component
│       ├── public/              # Static assets
│       └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coursell
   ```

2. **Install backend dependencies**
   ```bash
   cd coursell-be
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../coursell-fe/course-frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `coursell-be` directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/coursell
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd coursell-be
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd coursell-fe/course-frontend
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/user/signup` - User registration
- `POST /api/user/signin` - User login
- `POST /api/admin/signin` - Admin login

### Course Endpoints
- `GET /api/courses/preview` - Get published courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/purchase` - Purchase a course
- `GET /api/courses/:id/purchase` - Check purchase status

### Admin Endpoints
- `GET /api/admin/courses` - Get all courses (admin)
- `POST /api/admin/course` - Create course
- `PUT /api/admin/course` - Update course
- `DELETE /api/admin/course/:id` - Delete course

### User Endpoints
- `GET /api/user/purchases` - Get user's purchased courses
- `PUT /api/user/profile` - Update user profile

## 🎨 Design System

The application uses a comprehensive design system built with Chakra UI:

### Colors
- **Primary**: Purple (#6366f1)
- **Accent**: Yellow (#f59e0b)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter
- **Headings**: Bold with tight letter spacing
- **Body**: Regular weight with good line height

### Components
- **Buttons**: Multiple variants (solid, outline, ghost, accent)
- **Cards**: Rounded corners with hover effects
- **Forms**: Consistent styling with validation states
- **Badges**: Color-coded for different purposes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests
- **Security Headers**: Helmet.js for additional security
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

### Backend Testing
```bash
cd coursell-be
npm test
```

### Frontend Testing
```bash
cd coursell-fe/course-frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: hello@coursell.com
- Documentation: [docs.coursell.com](https://docs.coursell.com)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Chakra UI for the excellent component library
- React team for the amazing framework
- MongoDB for the flexible database solution
- All contributors who helped build this platform

---

**Made with ❤️ by the Coursell team** 
import { Box, useColorModeValue } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import CreateCourse from './pages/CreateCourse'
import EditCourse from './pages/EditCourse'
import { AuthProvider } from './context/AuthContext'

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'white')

  return (
    <AuthProvider>
      <Box minH="100vh" bg={bgColor} color={textColor}>
        <Navbar />
        <Box as="main" flex="1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-course" element={<CreateCourse />} />
            <Route path="/admin/edit-course/:id" element={<EditCourse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </Box>
    </AuthProvider>
  )
}

export default App

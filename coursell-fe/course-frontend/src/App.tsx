import { Box } from '@chakra-ui/react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
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
import ScrollToTop from './components/ScrollToTop'
import Contact from './pages/Contact'
import About from './pages/About'
import Help from './pages/Help'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box minH="100vh" bg="#080b0f" color="#e2e8f0" position="relative" overflow="hidden">
          {/* Faint grid */}
          <Box
            position="fixed"
            inset={0}
            zIndex={0}
            pointerEvents="none"
            backgroundImage="linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)"
            backgroundSize="60px 60px"
            sx={{
              maskImage:
                'radial-gradient(ellipse 70% 70% at 50% 30%, black 0%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 70% at 50% 30%, black 0%, transparent 100%)',
            }}
          />

          {/* Cyan glow */}
          <Box
            position="fixed"
            top="-120px"
            left="-100px"
            width="650px"
            height="650px"
            borderRadius="50%"
            background="radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)"
            pointerEvents="none"
            zIndex={0}
          />
          {/* Purple glow */}
          <Box
            position="fixed"
            top="40%"
            right="-150px"
            width="500px"
            height="500px"
            borderRadius="50%"
            background="radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)"
            pointerEvents="none"
            zIndex={0}
          />
          {/* Pink glow */}
          <Box
            position="fixed"
            bottom="-200px"
            left="30%"
            width="600px"
            height="600px"
            borderRadius="50%"
            background="radial-gradient(circle, rgba(255,77,109,0.05) 0%, transparent 70%)"
            pointerEvents="none"
            zIndex={0}
          />

          <Box position="relative" zIndex={1}>
            <Navbar />
            <ScrollToTop />
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
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0d1117',
                  color: '#e2e8f0',
                  border: '1px solid rgba(0,229,255,0.25)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '13px',
                },
              }}
            />
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  )
}

export default App

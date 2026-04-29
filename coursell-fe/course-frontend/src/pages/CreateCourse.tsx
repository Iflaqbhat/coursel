import { useNavigate } from 'react-router-dom'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useContext, useEffect } from 'react'
import CourseForm from '../components/CourseForm'
import { createCourse } from '../services/api'
import { AuthContext } from '../context/AuthContext'

const CreateCourse = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, isAdmin } = useContext(AuthContext)

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in as admin',
        status: 'error',
        duration: 3000,
      })
      navigate('/admin/login')
    }
  }, [user, isAdmin, navigate, toast])

  const handleSubmit = async (data: {
    title: string
    description: string
    price: number
    imageLink: string
    published: boolean
    category: string
    level: string
    videos: Array<{
      title: string
      description: string
      videoUrl: string
      duration: number
      order: number
    }>
  }) => {
    if (!user || !isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in as admin',
        status: 'error',
        duration: 3000,
      })
      navigate('/admin/login')
      return
    }
    try {
      await createCourse(data)
      toast({ title: 'Success', description: 'Course created', status: 'success', duration: 3000 })
      navigate('/admin/dashboard')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create course',
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Box minH="100vh" py={{ base: 12, md: 18 }}>
      <Container maxW="5xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="#7d8fa3" />}
            fontFamily="mono"
            fontSize="11px"
            letterSpacing="2px"
            textTransform="uppercase"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard" color="#7d8fa3">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="brand.400">Create</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <VStack align="start" spacing={3}>
            <Box className="section-label">Admin Action</Box>
            <Heading className="section-title">
              NEW <Box as="span" color="brand.400">COURSE</Box>
            </Heading>
            <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
              Add a new course to your platform.
            </Text>
          </VStack>

          <CourseForm onSubmit={handleSubmit} />
        </VStack>
      </Container>
    </Box>
  )
}

export default CreateCourse

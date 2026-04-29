import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import CourseForm from '../components/CourseForm'
import { getCourse, updateCourse } from '../services/api'

interface Video {
  _id?: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
}

interface Course {
  title: string
  description: string
  price: number
  imageLink: string
  published: boolean
  category?: string
  level?: string
  videos?: Video[]
}

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      toast({ title: 'Authentication Required', status: 'error', duration: 3000 })
      navigate('/admin/login')
      return
    }
    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getCourse(id!)
        setCourse(response.data.course)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load course')
        toast({ title: 'Error', status: 'error', duration: 4000 })
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchCourse()
  }, [id, navigate, token, toast])

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
    try {
      await updateCourse(id!, data)
      toast({ title: 'Success', description: 'Course updated', status: 'success', duration: 3000 })
      navigate('/admin/dashboard')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update',
        status: 'error',
        duration: 5000,
      })
    }
  }

  if (isLoading) {
    return (
      <Box minH="100vh">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.400" />
            <Text color="#7d8fa3" fontFamily="mono" letterSpacing="2px" textTransform="uppercase" fontSize="12px">
              Loading course...
            </Text>
          </VStack>
        </Center>
      </Box>
    )
  }

  if (error) {
    return (
      <Box minH="100vh" py={20}>
        <Container maxW="md" px={{ base: 4, md: 8 }}>
          <Alert
            status="error"
            bg="rgba(255,77,109,0.08)"
            color="pink.300"
            border="1px solid"
            borderColor="rgba(255,77,109,0.3)"
          >
            <AlertIcon color="pink.300" />
            {error}
          </Alert>
        </Container>
      </Box>
    )
  }

  if (!course) {
    return (
      <Box minH="100vh" py={20}>
        <Container maxW="md" px={{ base: 4, md: 8 }}>
          <Alert status="warning">
            <AlertIcon /> Course not found
          </Alert>
        </Container>
      </Box>
    )
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
              <BreadcrumbLink color="brand.400">Edit</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <VStack align="start" spacing={3}>
            <Box className="section-label">Admin Action</Box>
            <Heading className="section-title">
              EDIT <Box as="span" color="brand.400">COURSE</Box>
            </Heading>
          </VStack>

          <CourseForm onSubmit={handleSubmit} course={course} />
        </VStack>
      </Container>
    </Box>
  )
}

export default EditCourse

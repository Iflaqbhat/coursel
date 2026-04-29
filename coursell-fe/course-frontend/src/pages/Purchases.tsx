import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import CourseCard from '../components/CourseCard'
import { getPurchases } from '../services/api'

interface Course {
  id: string
  title: string
  description: string
  price: number
  imageLink: string
  published: boolean
  creator?: string
  category?: string
  level?: string
  rating?: number
  enrolledStudents?: number
  duration?: number
}

const Purchases = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/profile')
      return
    }
    const fetchPurchases = async () => {
      try {
        const response = await getPurchases()
        setCourses(response.data.courses)
      } catch (err) {
        // ignore
      }
    }
    fetchPurchases()
  }, [navigate, token])

  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={10}>
          <Box className="section-label">My Library</Box>
          <Heading className="section-title">
            PURCHASED <Box as="span" color="brand.400">COURSES</Box>
          </Heading>
        </VStack>

        {courses.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            bg="#0d1117"
            border="1px dashed"
            borderColor="rgba(255,255,255,0.12)"
          >
            <Text color="#7d8fa3" fontFamily="mono">
              No courses purchased yet.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} isPurchased />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}

export default Purchases

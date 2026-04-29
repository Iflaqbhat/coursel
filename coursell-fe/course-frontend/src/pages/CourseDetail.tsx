import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react'
import { FiCheck, FiDollarSign } from 'react-icons/fi'
import { checkPurchase, getCourse, purchaseCourse } from '../services/api'

interface Course {
  id: string
  title: string
  description: string
  price: number
  imageLink: string
  creator: string
}

const CourseDetail = () => {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const token = localStorage.getItem('token')
  const toast = useToast()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourse(id!)
        setCourse(response.data.course)
        if (token) {
          const purchaseResponse = await checkPurchase(id!)
          setIsPurchased(purchaseResponse.data.purchased)
        }
      } catch (err) {
        // ignore
      }
    }
    fetchCourse()
  }, [id, token])

  const handlePurchase = async () => {
    if (!token) {
      toast({ title: 'Please sign in to purchase', status: 'warning', duration: 3000 })
      return
    }
    try {
      await purchaseCourse(id!)
      setIsPurchased(true)
      toast({ title: 'Course purchased', status: 'success', duration: 3000 })
    } catch (err) {
      toast({ title: 'Purchase failed', status: 'error', duration: 3000 })
    }
  }

  if (!course) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="#7d8fa3" fontFamily="mono" letterSpacing="2px" textTransform="uppercase" fontSize="12px">
          Loading...
        </Text>
      </Box>
    )
  }

  return (
    <Box minH="100vh" py={{ base: 8, md: 16 }}>
      <Container maxW="4xl" px={{ base: 4, md: 8 }}>
        <Box
          bg="#0d1117"
          border="1px solid"
          borderColor="rgba(255,255,255,0.07)"
          overflow="hidden"
        >
          <Image src={course.imageLink} alt={course.title} w="100%" h="320px" objectFit="cover" />
          <Box p={{ base: 6, md: 10 }}>
            <Heading
              fontFamily="display"
              fontWeight={400}
              fontSize={{ base: '36px', md: '52px' }}
              color="white"
              letterSpacing="0.5px"
              mb={4}
            >
              {course.title.toUpperCase()}
            </Heading>
            <Text color="#7d8fa3" fontSize="md" mb={4} lineHeight="1.7">
              {course.description}
            </Text>
            <Text color="#7d8fa3" fontFamily="mono" fontSize="sm" letterSpacing="1px" mb={6}>
              By {course.creator}
            </Text>
            <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Heading fontFamily="display" fontWeight={400} color="brand.400" fontSize="42px">
                ${course.price}
              </Heading>
              {isPurchased ? (
                <Button
                  leftIcon={<FiCheck />}
                  bg="rgba(57,211,83,0.12)"
                  color="green.400"
                  border="1px solid"
                  borderColor="rgba(57,211,83,0.35)"
                  isDisabled
                  fontFamily="mono"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  fontSize="12px"
                  _disabled={{ opacity: 1 }}
                >
                  Owned
                </Button>
              ) : (
                <Button
                  variant="cyan"
                  leftIcon={<FiDollarSign />}
                  onClick={handlePurchase}
                  sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  Purchase Course
                </Button>
              )}
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default CourseDetail

import { useState, useEffect, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiClock, FiPlay, FiSearch, FiStar, FiUsers } from 'react-icons/fi'
import { getAdminCoursesBulk } from '../services/api'
import { AuthContext } from '../context/AuthContext'

interface Course {
  id: string
  _id: string
  title: string
  description: string
  price: number
  imageLink: string
  published: boolean
  creator: string
  category?: string
  level?: string
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'programming', label: 'Programming' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'music', label: 'Music' },
  { value: 'other', label: 'Other' },
]

export default function Courses() {
  const { isAdmin } = useContext(AuthContext)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await getAdminCoursesBulk()
      setCourses(response.data.courses)
    } catch (error) {
      toast({ title: 'Error fetching courses', status: 'error', duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <Box minH="100vh" py={20}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box
                key={i}
                bg="#0d1117"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                overflow="hidden"
              >
                <Skeleton height="200px" startColor="#111820" endColor="#1a2330" />
                <Box p={6}>
                  <Skeleton height="22px" mb={3} startColor="#111820" endColor="#1a2330" />
                  <SkeletonText noOfLines={3} startColor="#111820" endColor="#1a2330" />
                </Box>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={10}>
          <Box className="section-label">Course Catalog</Box>
          <Heading className="section-title">
            EXPLORE <Box as="span" color="brand.400">COURSES</Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm" maxW="2xl" mt={2}>
            Hand-picked, project-first courses to help you ship great work.
          </Text>
        </VStack>

        {isAdmin && (
          <Flex justify="flex-end" mb={6}>
            <Button
              as={RouterLink}
              to="/admin/create-course"
              variant="cyan"
              sx={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
            >
              + New Course
            </Button>
          </Flex>
        )}

        {/* FILTERS */}
        <Flex
          gap={3}
          mb={10}
          flexWrap="wrap"
          p={4}
          bg="#0d1117"
          border="1px solid"
          borderColor="rgba(255,255,255,0.07)"
          borderRadius="md"
        >
          <InputGroup maxW="420px" flex={1}>
            <InputLeftElement>
              <Icon as={FiSearch} color="#7d8fa3" />
            </InputLeftElement>
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fontFamily="mono"
              fontSize="sm"
            />
          </InputGroup>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            maxW="220px"
            fontFamily="mono"
            fontSize="sm"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} style={{ background: '#0d1117' }}>
                {c.label}
              </option>
            ))}
          </Select>
        </Flex>

        {filteredCourses.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            bg="#0d1117"
            border="1px dashed"
            borderColor="rgba(255,255,255,0.12)"
          >
            <Text color="#7d8fa3" fontFamily="mono">
              No courses match your filters.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {filteredCourses.map((course, idx) => (
              <Box
                key={course._id}
                position="relative"
                bg="#0d1117"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                transition="all .35s"
                _hover={{
                  borderColor: 'rgba(0,229,255,0.25)',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 30px rgba(0,229,255,0.06)',
                }}
              >
                <Text
                  position="absolute"
                  top="12px"
                  right="16px"
                  fontFamily="display"
                  color="rgba(255,255,255,0.05)"
                  fontSize="60px"
                  lineHeight={1}
                  pointerEvents="none"
                  zIndex={1}
                >
                  {String(idx + 1).padStart(2, '0')}
                </Text>

                <Box position="relative" h="200px" overflow="hidden">
                  <Image
                    src={course.imageLink || '/fallback-course.png'}
                    alt={course.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallbackSrc="/fallback-course.png"
                    sx={{
                      filter: 'brightness(0.85)',
                    }}
                  />
                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient="linear(to-t, rgba(13,17,23,0.95) 0%, transparent 60%)"
                  />
                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    bg="rgba(57,211,83,0.12)"
                    color="green.400"
                    border="1px solid"
                    borderColor="rgba(57,211,83,0.3)"
                  >
                    Live
                  </Badge>
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    bg="brand.500"
                    color="#080b0f"
                  >
                    ${course.price}
                  </Badge>
                </Box>

                <VStack align="stretch" p={6} spacing={4} flex={1}>
                  <Heading
                    fontFamily="display"
                    fontSize="22px"
                    fontWeight={400}
                    color="white"
                    noOfLines={2}
                  >
                    {course.title}
                  </Heading>
                  <Text
                    color="#7d8fa3"
                    fontSize="13px"
                    lineHeight="1.6"
                    noOfLines={3}
                  >
                    {course.description}
                  </Text>

                  <HStack spacing={3} fontSize="12px" color="#7d8fa3" fontFamily="mono">
                    <HStack spacing={1}>
                      <Icon as={FiStar} color="yellow.400" /> 4.5
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FiUsers} /> 1.2k
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FiClock} /> 10h
                    </HStack>
                  </HStack>

                  <HStack spacing={2} flexWrap="wrap">
                    <Badge variant="subtle" bg="rgba(0,229,255,0.06)" color="brand.300" border="1px solid" borderColor="rgba(0,229,255,0.18)">
                      {course.category || 'Programming'}
                    </Badge>
                    <Badge variant="subtle" bg="rgba(123,97,255,0.08)" color="purple.300" border="1px solid" borderColor="rgba(123,97,255,0.18)">
                      {course.level || 'Beginner'}
                    </Badge>
                  </HStack>

                  <Button
                    as={RouterLink}
                    to={`/courses/${course._id}`}
                    variant="outline"
                    leftIcon={<FiPlay />}
                    fontFamily="mono"
                    fontSize="12px"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    mt="auto"
                  >
                    View Course
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}

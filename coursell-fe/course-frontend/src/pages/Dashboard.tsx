import { useContext, useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  HStack,
  Heading,
  Icon,
  Image,
  Progress,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiMail,
  FiPlay,
  FiUser,
} from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

interface Course {
  _id: string
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  level: string
  duration: string
  videos: any[]
  imageLink?: string
}

export default function Dashboard() {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const toast = useToast()

  useEffect(() => {
    fetchPurchasedCourses()
  }, [])

  const fetchPurchasedCourses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/purchases`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPurchasedCourses(response.data.courses || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your courses',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = () => Math.floor(Math.random() * 100)

  if (loading) {
    return (
      <Box minH="100vh">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.400" />
            <Text color="#7d8fa3" fontFamily="mono" letterSpacing="2px" textTransform="uppercase" fontSize="12px">
              Loading dashboard...
            </Text>
          </VStack>
        </Center>
      </Box>
    )
  }

  const totalVideos = purchasedCourses.reduce(
    (acc, c) => acc + (c.videos?.length || 0),
    0
  )
  const totalHours = purchasedCourses.reduce((acc, c) => {
    const d = parseInt(c.duration?.replace(/\D/g, '') || '0')
    return acc + d
  }, 0)

  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={10} align="stretch">
          <VStack align="start" spacing={3}>
            <Box className="section-label">My Workspace</Box>
            <Heading className="section-title">
              HEY, <Box as="span" color="brand.400">{user?.name?.split(' ')[0]?.toUpperCase()}</Box>
            </Heading>
            <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
              Continue building. Continue shipping.
            </Text>
          </VStack>

          {/* STATS */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[
              { label: 'Total Courses', value: purchasedCourses.length, icon: FiAward },
              { label: 'Videos', value: totalVideos, icon: FiPlay },
              { label: 'Total Hours', value: `${totalHours}h`, icon: FiClock },
            ].map((s, i) => (
              <Box
                key={i}
                position="relative"
                p={6}
                bg="#0d1117"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                _hover={{ borderColor: 'rgba(0,229,255,0.2)' }}
                transition="all .3s"
                sx={{
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    bg: 'linear-gradient(90deg, #00e5ff, #7b61ff)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform .4s ease',
                  },
                  '&:hover::before': { transform: 'scaleX(1)' },
                }}
              >
                <Stat>
                  <StatLabel color="#7d8fa3" fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase">
                    {s.label}
                  </StatLabel>
                  <StatNumber fontFamily="display" color="brand.400" fontSize="48px" fontWeight={400}>
                    {s.value}
                  </StatNumber>
                  <Icon as={s.icon} color="purple.400" />
                </Stat>
              </Box>
            ))}
          </SimpleGrid>

          {/* PROFILE CARD */}
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="rgba(0,229,255,0.08)"
                  border="1px solid"
                  borderColor="rgba(0,229,255,0.18)"
                  borderRadius="md"
                >
                  <Icon as={FiUser} w={5} h={5} color="brand.400" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" fontFamily="display" fontWeight={400} color="white" letterSpacing="0.5px">
                    PROFILE INFO
                  </Heading>
                  <Text color="#7d8fa3" fontSize="sm">
                    Account details & quick edit
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack align="start" spacing={3}>
                  <HStack color="#7d8fa3" fontSize="sm">
                    <Icon as={FiUser} color="brand.400" />
                    <Text>{user?.name}</Text>
                  </HStack>
                  <HStack color="#7d8fa3" fontSize="sm">
                    <Icon as={FiMail} color="brand.400" />
                    <Text>{user?.email || '—'}</Text>
                  </HStack>
                  <HStack color="#7d8fa3" fontSize="sm">
                    <Icon as={FiCalendar} color="brand.400" />
                    <Text>Member since {new Date().toLocaleDateString()}</Text>
                  </HStack>
                </VStack>
                <Box>
                  <Button
                    as={RouterLink}
                    to="/profile"
                    variant="outline"
                    leftIcon={<FiUser />}
                    fontFamily="mono"
                    fontSize="12px"
                    letterSpacing="2px"
                    textTransform="uppercase"
                  >
                    Edit Profile
                  </Button>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* PURCHASED COURSES */}
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="rgba(123,97,255,0.08)"
                  border="1px solid"
                  borderColor="rgba(123,97,255,0.2)"
                  borderRadius="md"
                >
                  <Icon as={FiBookOpen} w={5} h={5} color="purple.400" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" fontFamily="display" fontWeight={400} color="white" letterSpacing="0.5px">
                    MY COURSES
                  </Heading>
                  <Text color="#7d8fa3" fontSize="sm">
                    Pick up where you left off
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              {purchasedCourses.length === 0 ? (
                <Center py={12}>
                  <VStack spacing={4}>
                    <Box
                      p={6}
                      bg="rgba(255,255,255,0.04)"
                      border="1px solid"
                      borderColor="rgba(255,255,255,0.07)"
                      borderRadius="full"
                    >
                      <Icon as={FiBookOpen} w={10} h={10} color="#7d8fa3" />
                    </Box>
                    <VStack spacing={1}>
                      <Heading size="sm" color="white">
                        No courses yet
                      </Heading>
                      <Text color="#7d8fa3" fontSize="sm" textAlign="center">
                        Start by exploring our curated catalog.
                      </Text>
                    </VStack>
                    <Button
                      as={RouterLink}
                      to="/courses"
                      variant="cyan"
                      leftIcon={<FiPlay />}
                      sx={{
                        clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                      }}
                    >
                      Browse Courses
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5}>
                  {purchasedCourses.map((course) => {
                    const progress = getProgressPercentage()
                    return (
                      <Box
                        key={course._id}
                        bg="#080b0f"
                        border="1px solid"
                        borderColor="rgba(255,255,255,0.07)"
                        overflow="hidden"
                        transition="all .3s"
                        _hover={{
                          borderColor: 'rgba(0,229,255,0.2)',
                          transform: 'translateY(-4px)',
                        }}
                      >
                        <Box position="relative" h="180px" bg="#111820">
                          {course.thumbnail || course.imageLink ? (
                            <Image
                              src={course.thumbnail || course.imageLink || ''}
                              alt={course.title}
                              w="full"
                              h="full"
                              objectFit="cover"
                              sx={{ filter: 'brightness(0.85)' }}
                            />
                          ) : (
                            <Center h="full">
                              <Icon as={FiBookOpen} w={10} h={10} color="#3d4f63" />
                            </Center>
                          )}
                          <Badge
                            position="absolute"
                            top={3}
                            right={3}
                            bg="rgba(123,97,255,0.18)"
                            color="purple.300"
                            border="1px solid"
                            borderColor="rgba(123,97,255,0.35)"
                          >
                            {course.level}
                          </Badge>
                        </Box>

                        <VStack align="start" p={5} spacing={3}>
                          <Heading
                            fontFamily="display"
                            fontSize="20px"
                            fontWeight={400}
                            color="white"
                            noOfLines={2}
                          >
                            {course.title}
                          </Heading>
                          <Text color="#7d8fa3" fontSize="13px" noOfLines={2}>
                            {course.description}
                          </Text>

                          <HStack justify="space-between" w="full" fontSize="11px" fontFamily="mono">
                            <Badge variant="subtle" bg="rgba(0,229,255,0.06)" color="brand.300">
                              {course.category}
                            </Badge>
                            <HStack color="#7d8fa3">
                              <Icon as={FiClock} />
                              <Text>{course.duration}</Text>
                            </HStack>
                          </HStack>

                          <Box w="full">
                            <HStack justify="space-between" mb={1} fontSize="11px" color="#7d8fa3" fontFamily="mono">
                              <Text>PROGRESS</Text>
                              <Text color="brand.400">{progress}%</Text>
                            </HStack>
                            <Progress
                              value={progress}
                              size="xs"
                              bg="rgba(255,255,255,0.05)"
                              colorScheme="blue"
                              borderRadius="full"
                            />
                          </Box>

                          <Button
                            as={RouterLink}
                            to={`/courses/${course._id}`}
                            variant="outline"
                            leftIcon={<FiPlay />}
                            w="full"
                            fontFamily="mono"
                            fontSize="11px"
                            letterSpacing="2px"
                            textTransform="uppercase"
                            size="sm"
                          >
                            Continue
                          </Button>
                        </VStack>
                      </Box>
                    )
                  })}
                </SimpleGrid>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

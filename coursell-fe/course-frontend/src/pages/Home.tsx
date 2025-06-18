import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  Badge,
  Image,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useContext } from 'react'
import { 
  FiPlay, 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiClock, 
  FiGlobe,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'

const featureImages = [
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', // books
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80', // clock
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', // certificate
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', // globe
];

export default function Home() {
  const { user } = useContext(AuthContext)
  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)'
  )
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('gray.800', 'white')

  const features = [
    {
      icon: FiBookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals and certified instructors'
    },
    {
      icon: FiClock,
      title: 'Learn at Your Pace',
      description: 'Access courses 24/7 and progress through content on your schedule'
    },
    {
      icon: FiAward,
      title: 'Certificates',
      description: 'Earn certificates upon completion to showcase your skills'
    },
    {
      icon: FiGlobe,
      title: 'Global Community',
      description: 'Connect with learners from around the world'
    }
  ]

  const stats = [
    { label: 'Active Students', value: '10K+', icon: FiUsers },
    { label: 'Expert Instructors', value: '500+', icon: FiAward },
    { label: 'Course Categories', value: '50+', icon: FiBookOpen },
    { label: 'Success Rate', value: '95%', icon: FiTrendingUp }
  ]

  return (
    <Box bgGradient="linear(to-br, brand.50, brand.100, white)" minH="100vh">
      {/* Hero Section */}
      <Box bgGradient="linear(135deg, #4f46e5 0%, #7c3aed 100%)" color="white" py={20} position="relative" overflow="hidden">
        <Box 
          position="absolute"
          top="-50px"
          left="-50px"
          w="200px"
          h="200px"
          bg="rgba(255, 255, 255, 0.05)"
          borderRadius="full"
          filter="blur(80px)"
          zIndex={0}
        />
        <Box 
          position="absolute"
          bottom="-100px"
          right="-100px"
          w="300px"
          h="300px"
          bg="rgba(255, 255, 255, 0.08)"
          borderRadius="full"
          filter="blur(100px)"
          zIndex={0}
        />
        <Container maxW="7xl" position="relative" zIndex={1}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <VStack align="start" spacing={8}>
              <Badge 
                colorScheme="purple" 
                variant="solid"
                px={4} 
                py={2} 
                borderRadius="full"
                fontSize="sm"
                bg="purple.400"
              >
                🚀 Transform Your Career Today
              </Badge>
              <Heading
                size="2xl"
                fontWeight="bold"
                lineHeight="1.2"
                color="white"
              >
                Master New Skills with{' '}
                <Text as="span" color="yellow.300">
                  Expert-Led Courses
                </Text>
              </Heading>
              <Text fontSize="xl" opacity={0.9} maxW="md" color="purple.100">
                Join thousands of learners worldwide. Access premium courses, 
                learn from industry experts, and advance your career with our 
                comprehensive learning platform.
              </Text>
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as={RouterLink}
                  to="/courses"
                  size="lg"
                  variant="accent"
                  leftIcon={<FiPlay />}
                  bgGradient="linear(to-r, purple.500, purple.700)"
                  color="white"
                  _hover={{ bgGradient: 'linear(to-r, purple.600, purple.800)', boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  Explore Courses
                </Button>
                <Button
                  as={RouterLink}
                  to="/courses"
                  size="lg"
                  variant="outline"
                  color="white"
                  borderColor="purple.200"
                  _hover={{ bg: 'purple.500', borderColor: 'purple.500' }}
                >
                  Get Started Free
                </Button>
              </HStack>
            </VStack>
            <Box position="relative">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Students learning"
                borderRadius="2xl"
                shadow="2xl"
              />
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bgGradient="linear(to-r, brand.50, brand.100)" shadow="md">
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <Stat key={index} textAlign="center" p={4} borderRadius="lg" bg="white" boxShadow="lg">
                <StatLabel color="gray.600" fontSize="md" fontWeight="bold">
                  {stat.label}
                </StatLabel>
                <StatNumber color="purple.600" fontSize="4xl" fontWeight="extrabold">
                  {stat.value}
                </StatNumber>
                <StatHelpText>
                  <Icon as={stat.icon} color="purple.400" w={6} h={6} />
                </StatHelpText>
              </Stat>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bgGradient="linear(to-br, brand.100, white)">
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="2xl">
              <Heading size="xl" color={headingColor}>
                Why Choose Coursell?
              </Heading>
              <Text fontSize="lg" color={subTextColor}>
                Our platform is designed to provide the best learning experience 
                with cutting-edge features and expert content.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  p={0}
                  textAlign="center" 
                  shadow="2xl" 
                  borderRadius="2xl" 
                  bg="rgba(255,255,255,0.85)"
                  style={{ backdropFilter: 'blur(8px)' }}
                  overflow="hidden"
                  position="relative"
                  _hover={{ shadow: '3xl', transform: 'translateY(-8px) scale(1.03)' }} 
                  transition="all 0.3s"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    zIndex={0}
                  >
                    <Image
                      src={featureImages[index]}
                      alt={feature.title}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      opacity={0.92}
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      w="100%"
                      h="100%"
                      bg="rgba(0,0,0,0.45)"
                      zIndex={1}
                    />
                  </Box>
                  <CardBody position="relative" zIndex={2} p={8}>
                    <VStack spacing={4}>
                      <Box
                        p={3}
                        bg="whiteAlpha.300"
                        borderRadius="full"
                        color="white"
                        boxShadow="md"
                        mb={2}
                      >
                        <Icon as={feature.icon} w={7} h={7} />
                      </Box>
                      <VStack spacing={2}>
                        <Heading size="md" color="white" fontWeight="bold">
                          {feature.title}
                        </Heading>
                        <Text color="white" fontWeight="semibold" fontSize="sm" textShadow="0 2px 8px rgba(0,0,0,0.25)">
                          {feature.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      {!user ? (
        <Box bgGradient="linear(135deg, #4f46e5 0%, #7c3aed 100%)" color="white" py={20} textAlign="center">
          <Container maxW="4xl">
            <VStack spacing={6}>
              <Heading size="xl" fontWeight="bold">
                Ready to Start Your Learning Journey?
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Join thousands of learners and unlock your full potential today.
              </Text>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                variant="accent"
                leftIcon={<FiZap />}
                bgGradient="linear(to-r, purple.500, purple.700)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, purple.600, purple.800)', boxShadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                Sign Up Now
              </Button>
            </VStack>
          </Container>
        </Box>
      ) : (
        <Box bgGradient="linear(135deg, #4f46e5 0%, #7c3aed 100%)" color="white" py={20} textAlign="center">
          <Container maxW="4xl">
            <VStack spacing={6}>
              <Heading size="xl" fontWeight="bold">
                Welcome back, {user.name ? user.name : user.email}!
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Continue your learning journey with our latest courses and track your progress.
              </Text>
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  as={RouterLink}
                  to="/courses"
                  size="lg"
                  variant="accent"
                  leftIcon={<FiPlay />}
                  bgGradient="linear(to-r, purple.500, purple.700)"
                  color="white"
                  _hover={{ bgGradient: 'linear(to-r, purple.600, purple.800)', boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  Browse Courses
                </Button>
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  size="lg"
                  variant="outline"
                  color="white"
                  borderColor="purple.200"
                  _hover={{ bg: 'purple.500', borderColor: 'purple.500' }}
                >
                  My Dashboard
                </Button>
              </HStack>
            </VStack>
          </Container>
        </Box>
      )}
    </Box>
  )
}

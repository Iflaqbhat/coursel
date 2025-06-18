import { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Card, 
  CardBody, 
  CardHeader,
  SimpleGrid,
  Badge,
  Button,
  Icon,
  useToast,
  Spinner,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Image,
  Progress
} from '@chakra-ui/react';
import { 
  FiBookOpen, 
  FiPlay, 
  FiClock, 
  FiAward,
  FiUser,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  videos: any[];
}

export default function Dashboard() {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/purchases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchasedCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your courses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    // Mock progress - in real app this would come from backend
    return Math.floor(Math.random() * 100);
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.600">Loading your dashboard...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading 
              size="2xl" 
              color="gray.800" 
              fontWeight="bold"
              mb={2}
            >
              Welcome back, {user?.name}! 👋
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Continue your learning journey with your purchased courses
            </Text>
          </Box>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg="white" boxShadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    Total Courses
                  </StatLabel>
                  <StatNumber color="purple.600" fontSize="3xl" fontWeight="bold">
                    {purchasedCourses.length}
                  </StatNumber>
                  <StatHelpText color="green.500" fontSize="sm">
                    <Icon as={FiAward} mr={1} />
                    Active learner
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="white" boxShadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    Total Videos
                  </StatLabel>
                  <StatNumber color="purple.600" fontSize="3xl" fontWeight="bold">
                    {purchasedCourses.reduce((acc, course) => acc + (course.videos?.length || 0), 0)}
                  </StatNumber>
                  <StatHelpText color="blue.500" fontSize="sm">
                    <Icon as={FiPlay} mr={1} />
                    Available to watch
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="white" boxShadow="lg" borderRadius="xl">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">
                    Learning Time
                  </StatLabel>
                  <StatNumber color="purple.600" fontSize="3xl" fontWeight="bold">
                    {purchasedCourses.reduce((acc, course) => {
                      const duration = parseInt(course.duration?.replace(/\D/g, '') || '0');
                      return acc + duration;
                    }, 0)}h
                  </StatNumber>
                  <StatHelpText color="orange.500" fontSize="sm">
                    <Icon as={FiClock} mr={1} />
                    Total duration
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* User Info Card */}
          <Card bg="white" boxShadow="lg" borderRadius="xl">
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  borderRadius="xl"
                >
                  <Icon as={FiUser} w={6} h={6} color="white" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">
                    Profile Information
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Your account details and preferences
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <Icon as={FiUser} color="gray.400" />
                    <Text color="gray.600">
                      <strong>Name:</strong> {user?.name}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiMail} color="gray.400" />
                    <Text color="gray.600">
                      <strong>Email:</strong> {user?.email}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiCalendar} color="gray.400" />
                    <Text color="gray.600">
                      <strong>Member since:</strong> {new Date().toLocaleDateString()}
                    </Text>
                  </HStack>
                </VStack>
                <VStack align="start" spacing={3}>
                  <Button
                    as={RouterLink}
                    to="/profile"
                    colorScheme="purple"
                    variant="outline"
                    leftIcon={<FiUser />}
                    size="md"
                  >
                    Edit Profile
                  </Button>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Purchased Courses */}
          <Card bg="white" boxShadow="lg" borderRadius="xl">
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  borderRadius="xl"
                >
                  <Icon as={FiBookOpen} w={6} h={6} color="white" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">
                    My Courses
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Continue learning from where you left off
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
                      bg="gray.100"
                      borderRadius="full"
                    >
                      <Icon as={FiBookOpen} w={12} h={12} color="gray.400" />
                    </Box>
                    <VStack spacing={2}>
                      <Heading size="md" color="gray.600">
                        No courses purchased yet
                      </Heading>
                      <Text color="gray.500" textAlign="center">
                        Start your learning journey by exploring our course catalog
                      </Text>
                    </VStack>
                    <Button
                      as={RouterLink}
                      to="/courses"
                      colorScheme="purple"
                      size="lg"
                      leftIcon={<FiPlay />}
                    >
                      Browse Courses
                    </Button>
                  </VStack>
                </Center>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {purchasedCourses.map((course) => (
                    <Card 
                      key={course._id} 
                      bg="gray.50" 
                      boxShadow="md" 
                      borderRadius="xl"
                      _hover={{ 
                        transform: 'translateY(-4px)', 
                        boxShadow: 'xl',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Box
                        h="200px"
                        bg="gray.200"
                        borderRadius="xl"
                        mb={4}
                        overflow="hidden"
                        position="relative"
                      >
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                        ) : (
                          <Center h="full">
                            <Icon as={FiBookOpen} w={12} h={12} color="gray.400" />
                          </Center>
                        )}
                        <Badge
                          position="absolute"
                          top={3}
                          right={3}
                          colorScheme="purple"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {course.level}
                        </Badge>
                      </Box>
                      
                      <CardBody pt={0}>
                        <VStack align="start" spacing={3}>
                          <VStack align="start" spacing={1} w="full">
                            <Heading size="md" color="gray.800" noOfLines={2}>
                              {course.title}
                            </Heading>
                            <Text color="gray.600" fontSize="sm" noOfLines={2}>
                              {course.description}
                            </Text>
                          </VStack>

                          <HStack justify="space-between" w="full">
                            <Badge colorScheme="blue" borderRadius="full">
                              {course.category}
                            </Badge>
                            <Text color="gray.500" fontSize="sm">
                              <Icon as={FiClock} mr={1} />
                              {course.duration}
                            </Text>
                          </HStack>

                          <VStack spacing={2} w="full">
                            <HStack justify="space-between" w="full">
                              <Text fontSize="sm" color="gray.600">
                                Progress
                              </Text>
                              <Text fontSize="sm" color="purple.600" fontWeight="medium">
                                {getProgressPercentage()}%
                              </Text>
                            </HStack>
                            <Progress 
                              value={getProgressPercentage()} 
                              colorScheme="purple" 
                              borderRadius="full"
                              size="sm"
                            />
                          </VStack>

                          <Button
                            as={RouterLink}
                            to={`/courses/${course._id}`}
                            colorScheme="purple"
                            size="md"
                            w="full"
                            leftIcon={<FiPlay />}
                          >
                            Continue Learning
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
} 
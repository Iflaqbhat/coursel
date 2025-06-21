import { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Image,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Icon,
  useToast,
  Skeleton,
  SkeletonText,
  Flex,
  Avatar,
  SimpleGrid,
  Alert,
  AlertIcon,
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiBookOpen, 
  FiClock, 
  FiUsers, 
  FiStar,
  FiPlay, 
  FiCheck,
  FiArrowLeft,
  FiLock,
  FiVideo,
  FiDollarSign,
  FiShield,
  FiAward
} from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
  createdAt: string;
  enrolledStudents?: string[];
  rating?: number;
  content?: string;
  videos?: Video[];
  category?: string;
  level?: string;
}

export default function CourseDetails() {
  const { id: paramId } = useParams();
  const id = paramId;
  const { user, isAdmin } = useContext(AuthContext);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const badgeColor = useColorModeValue('purple.500', 'purple.300');

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchRelatedCourses();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const headers = user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, { headers });
      
      setCourse(response.data.course);
      // Admins have access to all courses
      setHasAccess(response.data.hasAccess || isAdmin);
    } catch (error) {
      toast({
        title: 'Error fetching course',
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
      // Exclude the current course
      setRelatedCourses(response.data.filter((c: Course) => c._id !== id));
    } catch (error) {
      // Optionally handle error
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: 'Please login to purchase',
        description: 'You need to be logged in to purchase this course',
        status: 'warning',
        duration: 3000
      });
      return;
    }

    setPurchasing(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/purchase/course/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast({
        title: '🎉 Course purchased successfully!',
        description: 'You now have lifetime access to all course content.',
        status: 'success',
        duration: 5000
      });
      
      // Refresh course data to show videos
      fetchCourse();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Purchase failed',
        description: error.response?.data?.message || 'Please try again later.',
        status: 'error',
        duration: 3000
      });
    } finally {
      setPurchasing(false);
    }
  };

  const openPurchaseModal = () => {
    if (!user) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to purchase courses',
        status: 'warning',
        duration: 3000
      });
      return;
    }
    onOpen();
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            <VStack align="stretch" spacing={6}>
              <Skeleton height="400px" borderRadius="xl" startColor="gray.700" endColor="gray.600" />
              <Skeleton height="32px" startColor="gray.700" endColor="gray.600" />
              <SkeletonText noOfLines={4} startColor="gray.700" endColor="gray.600" />
            </VStack>
            <Skeleton height="400px" borderRadius="xl" startColor="gray.700" endColor="gray.600" />
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <Alert status="error" borderRadius="xl" bg="red.700" color="white">
            <AlertIcon />
            Course not found. Please check the URL and try again.
          </Alert>
        </Container>
      </Box>
    );
  }

  const features = [
    { icon: FiBookOpen, label: 'Lifetime Access', value: 'Yes' },
    { icon: FiClock, label: 'Duration', value: '10+ hours' },
    { icon: FiUsers, label: 'Students', value: `${course.enrolledStudents?.length || 0} enrolled` },
    { icon: FiStar, label: 'Rating', value: `${course.rating || 4.5}/5` }
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Back Button */}
          <Button
            as={RouterLink}
            to="/courses"
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            alignSelf="start"
            color={subTextColor}
            _hover={{ bg: 'gray.700' }}
          >
            Back to Courses
          </Button>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Main Content */}
            <VStack align="stretch" spacing={6}>
              {/* Course Image */}
              <Box
                bg={cardBg}
                height="400px"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="xl"
                position="relative"
              >
                <Image
                  src={course.imageLink || '/fallback-course.png'}
                  alt={course.title}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  fallbackSrc="/fallback-course.png"
                />
                <Badge
                  position="absolute"
                  top={4}
                  left={4}
                  colorScheme="purple"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="md"
                  bg={badgeColor}
                  color="white"
                >
                  {course.category || 'Development'}
                </Badge>
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme="orange"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="md"
                  bg="orange.400"
                  color="white"
                >
                  {course.level || 'Beginner'}
                </Badge>
              </Box>

              {/* Course Info */}
              <VStack align="start" spacing={4} p={6} bg={cardBg} borderRadius="2xl" boxShadow="xl">
                <Heading size="xl" color={headingColor}>
                  {course.title}
                </Heading>
                <Text fontSize="lg" color={subTextColor}>
                  {course.description}
                </Text>
                <Divider borderColor={dividerColor} />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  {features.map((feature, index) => (
                    <HStack key={index} spacing={3}>
                      <Icon as={feature.icon} color="purple.400" w={5} h={5} />
                      <Text color={subTextColor} fontWeight="medium">{feature.label}:</Text>
                      <Text color={textColor}>{feature.value}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </VStack>

              {/* Course Content / Videos */}
              <VStack align="start" spacing={6} p={6} bg={cardBg} borderRadius="2xl" boxShadow="xl">
                <Heading size="lg" color={headingColor}>
                  Course Content
                </Heading>
                <Text color={subTextColor}>
                  {hasAccess ? (
                    'Dive deep into the course material with these comprehensive videos:'
                  ) : (
                    <HStack>
                      <Icon as={FiLock} color="orange.400" />
                      <Text color="orange.400" fontWeight="semibold">
                        Purchase this course to unlock all video content.
                      </Text>
                    </HStack>
                  )}
                </Text>

                <List spacing={3} w="full">
                  {course.videos && course.videos.length > 0 ? (
                    course.videos.sort((a, b) => a.order - b.order).map((video) => (
                      <ListItem 
                        key={video._id} 
                        display="flex" 
                        alignItems="center" 
                        py={3} 
                        px={4} 
                        bg={selectedVideo && selectedVideo._id === video._id ? 'purple.50' : useColorModeValue('gray.50', 'gray.700')}
                        borderRadius="lg"
                        shadow="sm"
                        _hover={hasAccess ? { bg: 'purple.100', cursor: 'pointer' } : {}}
                        transition="all 0.2s"
                        onClick={() => hasAccess && setSelectedVideo(video)}
                      >
                        <HStack spacing={4} flex="1">
                          <Icon 
                            as={hasAccess ? FiPlay : FiLock} 
                            color={hasAccess ? 'purple.500' : 'orange.400'} 
                            w={6} h={6}
                          />
                          <VStack align="start" spacing={0} flex="1">
                            <Text fontWeight="semibold" color={textColor}>
                              {video.title}
                            </Text>
                            <Text fontSize="sm" color={subTextColor}>
                              {video.description}
                            </Text>
                          </VStack>
                        </HStack>
                        <Text fontSize="sm" color={subTextColor} ml={4}>
                          {formatDuration(video.duration)}
                        </Text>
                        {!hasAccess && (
                          <Icon as={FiLock} color="orange.400" ml={2} />
                        )}
                      </ListItem>
                    ))
                  ) : (
                    <Text color={subTextColor} textAlign="center" py={10}>
                      No videos available for this course yet.
                    </Text>
                  )}
                </List>
              </VStack>

              {/* Author Info (Optional) */}
              <Card bg={cardBg} borderRadius="2xl" boxShadow="xl">
                <CardHeader>
                  <HStack spacing={4}>
                    <Avatar name="Jane Doe" src="/fallback-avatar.png" size="lg" />
                    <VStack align="start" spacing={1}>
                      <Heading size="md" color={headingColor}>
                        About the Instructor
                      </Heading>
                      <Text color={subTextColor} fontSize="sm">
                        Jane Doe, a seasoned expert in web development with 10+ years of experience.
                      </Text>
                    </VStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Text color={subTextColor}>
                    Jane is passionate about teaching and has helped thousands of students master their skills. Her courses are known for their clarity and practical examples.
                  </Text>
                </CardBody>
              </Card>

              {/* Video Player: Only show if a video is selected */}
              {hasAccess && selectedVideo && (
                <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
                  <Heading size="md" mb={2}>{selectedVideo.title}</Heading>
                  <Text mb={2}>{selectedVideo.description}</Text>
                  <video width="100%" height="360" controls style={{ borderRadius: '8px' }}>
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
            </VStack>

            {/* Sidebar / Purchase Section */}
            <VStack align="stretch" spacing={6}>
              <Card bg={cardBg} borderRadius="2xl" boxShadow="xl">
                <CardBody p={6}>
                  <VStack spacing={4}>
                    <Heading size="xl" color={headingColor}>
                      {isAdmin ? 'Free' : `$${course.price}`}
                    </Heading>
                    <Text color={subTextColor}>
                      {isAdmin ? 'Full admin access to all course materials' : 'Lifetime access to all course materials'}
                    </Text>

                    {hasAccess ? (
                      <Button
                        colorScheme="green"
                        size="lg"
                        w="full"
                        leftIcon={<FiCheck />}
                        isDisabled
                      >
                        {isAdmin ? 'Admin Access' : 'Purchased!'}
                      </Button>
                    ) : (
                      user && user.role === 'user' ? (
                        <Button
                          colorScheme="purple"
                          size="lg"
                          w="full"
                          leftIcon={<FiDollarSign />}
                          onClick={openPurchaseModal}
                          isLoading={purchasing}
                          loadingText="Processing..."
                        >
                          Purchase Course
                        </Button>
                      ) : isAdmin ? (
                        <Button
                          colorScheme="green"
                          size="lg"
                          w="full"
                          leftIcon={<FiCheck />}
                          isDisabled
                        >
                          Admin Access
                        </Button>
                      ) : (
                        <Button
                          colorScheme="purple"
                          size="lg"
                          w="full"
                          leftIcon={<FiDollarSign />}
                          onClick={openPurchaseModal}
                          isLoading={purchasing}
                          loadingText="Processing..."
                        >
                          Login to Purchase
                        </Button>
                      )
                    )}

                    <Divider borderColor={dividerColor} />

                    <VStack align="start" spacing={3} w="full">
                      <HStack spacing={3} color={subTextColor}>
                        <Icon as={FiVideo} color={iconColor} />
                        <Text>Full lifetime access to {course.videos?.length || 0} videos</Text>
                      </HStack>
                      <HStack spacing={3} color={subTextColor}>
                        <Icon as={FiAward} color={iconColor} />
                        <Text>Certificate of completion</Text>
                      </HStack>
                      <HStack spacing={3} color={subTextColor}>
                        <Icon as={FiShield} color={iconColor} />
                        <Text>30-day money-back guarantee</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Related Courses Section */}
              {relatedCourses && relatedCourses.length > 0 && (
                <Card bg={cardBg} borderRadius="2xl" boxShadow="xl">
                  <CardHeader>
                    <Heading size="md" color={headingColor}>
                      Related Courses
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {relatedCourses.map((rc) => (
                        <Flex
                          key={rc._id}
                          align="center"
                          as={RouterLink}
                          to={`/courses/${rc._id}`}
                          _hover={{ bg: useColorModeValue('gray.50', 'gray.700'), textDecoration: 'none' }}
                          p={3}
                          borderRadius="lg"
                          transition="all 0.2s"
                        >
                          <Image
                            src={rc.imageLink || '/fallback-course.png'}
                            alt={rc.title}
                            boxSize="50px"
                            borderRadius="md"
                            mr={3}
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium" color={textColor}>{rc.title}</Text>
                            <Text fontSize="sm" color={subTextColor}>{rc.category || 'Category'}</Text>
                          </VStack>
                        </Flex>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </Grid>

          {/* Purchase Confirmation Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
            <ModalContent bg={cardBg} borderRadius="2xl" boxShadow="2xl" p={6}>
              <ModalHeader color={headingColor} fontSize="2xl" fontWeight="bold" textAlign="center">Confirm Purchase</ModalHeader>
              <ModalCloseButton color={iconColor} />
              <ModalBody>
                <VStack spacing={6}>
                  <Icon as={FiDollarSign} w={20} h={20} color="purple.400" />
                  <Text fontSize="lg" color={subTextColor} textAlign="center">
                    You are about to purchase:
                  </Text>
                  <Heading size="lg" color={headingColor} textAlign="center">
                    {course.title}
                  </Heading>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    Total: ${course.price}
                  </Text>
                  <Alert status="info" borderRadius="md" bg="blue.700" color="white">
                    <AlertIcon />
                    Please pay the required amount to get the course.
                  </Alert>
                  <Button
                    colorScheme="purple"
                    size="lg"
                    w="full"
                    onClick={handlePurchase}
                    isLoading={purchasing}
                    loadingText="Processing..."
                    leftIcon={<FiDollarSign />}
                  >
                    Confirm Purchase
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  );
} 
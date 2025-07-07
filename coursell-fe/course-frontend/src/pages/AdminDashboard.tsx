import { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Switch,
  HStack,
  VStack,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiDollarSign, 
  FiUsers, 
  FiBookOpen,
  FiTrendingUp,
  FiMoreVertical,
  FiSettings,
  FiLogOut,
  FiVideo,
  FiPlay
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAdminCourses, createCourse } from '../services/api';

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
  videos?: Video[];
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalRevenue: 0,
    totalStudents: 0,
    publishedCourses: 0
  });

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    imageLink: '',
    published: true,
    category: 'programming',
    level: 'beginner',
    videos: []
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    order: 1
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchCourses();
  }, [isAdmin, navigate]);

  const fetchCourses = async () => {
    try {
      const response = await getAdminCourses();
      setCourses(response.data.courses);
      
      // Calculate stats
      const totalRevenue = response.data.courses.reduce((sum: number, course: Course) => 
        sum + (course.price * (course.enrolledStudents?.length || 0)), 0);
      
      setStats({
        totalCourses: response.data.courses.length,
        totalRevenue,
        totalStudents: response.data.courses.reduce((sum: number, course: Course) => 
          sum + (course.enrolledStudents?.length || 0), 0),
        publishedCourses: response.data.courses.filter((course: Course) => course.published).length
      });
    } catch (error) {
      toast({
        title: 'Error fetching courses',
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      await createCourse(newCourse);
      toast({
        title: 'Course created successfully!',
        status: 'success',
        duration: 3000
      });
      onClose();
      setNewCourse({ title: '', description: '', price: 0, imageLink: '', published: true, category: 'programming', level: 'beginner', videos: [] });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: 'Error creating course',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleAddVideo = async () => {
    if (!selectedCourse) return;
    
    try {
      const currentVideos = selectedCourse.videos || [];
      const newVideoData = {
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: newVideo.videoUrl,
        duration: newVideo.duration,
        order: newVideo.order
      };
      
      const updatedVideos = [...currentVideos, newVideoData];
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/course/${selectedCourse._id}/videos`, {
        videos: updatedVideos
      });
      
      toast({
        title: 'Video added successfully!',
        status: 'success',
        duration: 3000
      });
      
      onVideoClose();
      setNewVideo({ title: '', description: '', videoUrl: '', duration: 0, order: 1 });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: 'Error adding video',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/course/${courseId}`);
        toast({
          title: 'Course deleted successfully!',
          status: 'success',
          duration: 3000
        });
        fetchCourses();
      } catch (error: any) {
        toast({
          title: 'Error deleting course',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 3000
        });
      }
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!selectedCourse) return;
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      // Remove the video from the selected course's videos
      const updatedVideos = (selectedCourse.videos || []).filter(v => v._id !== videoId);
      // Reorder remaining videos
      updatedVideos.forEach((video, idx) => {
        video.order = idx + 1;
      });
      // Send updated videos to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/course/${selectedCourse._id}/videos`, {
        videos: updatedVideos
      });
      toast({
        title: 'Video deleted successfully!',
        status: 'success',
        duration: 3000
      });
      // Update selectedCourse immediately for instant UI update
      setSelectedCourse({ ...selectedCourse, videos: updatedVideos });
      // Optionally refresh courses in the background
      fetchCourses();
    } catch (error: any) {
      toast({
        title: 'Error deleting video',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const openVideoModal = (course: Course) => {
    setSelectedCourse(course);
    onVideoOpen();
  };

  if (!isAdmin) return null;

  return (
    <Box minH="100vh" bg="gray.900">
      {/* Header */}
      <Box bg="gray.800" borderBottom="1px" borderColor="gray.700" px={6} py={4}>
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="white">Admin Dashboard</Heading>
          <HStack spacing={4}>
            <IconButton
              aria-label="Settings"
              icon={<FiSettings />}
              variant="ghost"
              size="sm"
              color="gray.300"
              _hover={{ bg: 'gray.700' }}
            />
            <Button
              leftIcon={<FiLogOut />}
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              color="gray.300"
              _hover={{ bg: 'gray.700' }}
            >
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="7xl" py={8} px={{ base: 2, md: 8 }}>
        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(auto-fit, minmax(250px, 1fr))' }} gap={6} mb={8}>
          <Card bg="gray.800" borderColor="gray.700">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Total Courses</StatLabel>
                <StatNumber color="blue.400">{stats.totalCourses}</StatNumber>
                <StatHelpText>
                  <Icon as={FiBookOpen} mr={1} />
                  Active courses
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg="gray.800" borderColor="gray.700">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Total Revenue</StatLabel>
                <StatNumber color="green.400">${stats.totalRevenue}</StatNumber>
                <StatHelpText>
                  <Icon as={FiDollarSign} mr={1} />
                  Lifetime earnings
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg="gray.800" borderColor="gray.700">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Total Students</StatLabel>
                <StatNumber color="purple.400">{stats.totalStudents}</StatNumber>
                <StatHelpText>
                  <Icon as={FiUsers} mr={1} />
                  Enrolled students
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg="gray.800" borderColor="gray.700">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">Published Courses</StatLabel>
                <StatNumber color="orange.400">{stats.publishedCourses}</StatNumber>
                <StatHelpText>
                  <Icon as={FiTrendingUp} mr={1} />
                  Live courses
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Actions */}
        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Heading size="md" color="white">Your Courses</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen} w={{ base: 'full', md: 'auto' }}>
            Create Course
          </Button>
        </Flex>

        {/* Courses Table */}
        <Box overflowX={{ base: 'auto', md: 'visible' }}>
          <Card bg="gray.800" borderColor="gray.700">
            <CardHeader>
              <Heading size="md" color="white">Course Management</Heading>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Text color="gray.400">Loading courses...</Text>
              ) : courses.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="gray.400" mb={4}>No courses yet</Text>
                  <Button colorScheme="blue" onClick={onOpen}>
                    Create your first course
                  </Button>
                </Box>
              ) : (
                <Table variant="simple" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th color="gray.300">Course</Th>
                      <Th color="gray.300">Price</Th>
                      <Th color="gray.300">Status</Th>
                      <Th color="gray.300">Students</Th>
                      <Th color="gray.300">Videos</Th>
                      <Th color="gray.300">Created</Th>
                      <Th color="gray.300">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {courses.map((course) => (
                      <Tr key={course._id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" color="white">{course.title}</Text>
                            <Text fontSize="sm" color="gray.400" noOfLines={2}>
                              {course.description}
                            </Text>
                          </VStack>
                        </Td>
                        <Td color="white">${course.price}</Td>
                        <Td>
                          <Badge
                            colorScheme={course.published ? 'green' : 'gray'}
                          >
                            {course.published ? 'Published' : 'Draft'}
                          </Badge>
                        </Td>
                        <Td color="white">{course.enrolledStudents?.length || 0}</Td>
                        <Td color="white">{course.videos?.length || 0}</Td>
                        <Td color="gray.400">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              leftIcon={<FiVideo />}
                              onClick={() => openVideoModal(course)}
                            >
                              Videos
                            </Button>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                                color="gray.300"
                                _hover={{ bg: 'gray.700' }}
                              />
                              <MenuList bg="gray.800" borderColor="gray.700">
                                <MenuItem icon={<FiEye />} _hover={{ bg: 'gray.700' }} onClick={() => navigate(`/courses/${course._id}`)}>View</MenuItem>
                                <MenuItem icon={<FiEdit />} _hover={{ bg: 'gray.700' }}>Edit</MenuItem>
                                <MenuItem 
                                  icon={<FiTrash2 />} 
                                  color="red.400"
                                  onClick={() => handleDeleteCourse(course._id)}
                                  _hover={{ bg: 'gray.700' }}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Box>
      </Container>

      {/* Create Course Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" borderColor="gray.700">
          <ModalHeader color="white">Create New Course</ModalHeader>
          <ModalCloseButton color="gray.300" />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Course Title</FormLabel>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  placeholder="Enter course title"
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel color="gray.300">Description</FormLabel>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Enter course description"
                  rows={4}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel color="gray.300">Price ($)</FormLabel>
                <NumberInput
                  value={newCourse.price}
                  onChange={(value) => setNewCourse({...newCourse, price: Number(value)})}
                  min={0}
                >
                  <NumberInputField 
                    placeholder="0.00" 
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _focus={{ borderColor: 'blue.400' }}
                  />
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel color="gray.300">Image URL</FormLabel>
                <Input
                  value={newCourse.imageLink}
                  onChange={(e) => setNewCourse({...newCourse, imageLink: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'blue.400' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Category</FormLabel>
                <Select
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'blue.400' }}
                >
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                  <option value="music">Music</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Level</FormLabel>
                <Select
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _focus={{ borderColor: 'blue.400' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" color="gray.300">Published</FormLabel>
                <Switch
                  isChecked={newCourse.published}
                  onChange={(e) => setNewCourse({...newCourse, published: e.target.checked})}
                />
              </FormControl>
              
              <HStack spacing={4} w="full">
                <Button onClick={onClose} variant="ghost" flex={1} color="gray.300">
                  Cancel
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleCreateCourse}
                  flex={1}
                  isDisabled={!newCourse.title || !newCourse.description}
                >
                  Create Course
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Add Video Modal */}
      <Modal isOpen={isVideoOpen} onClose={onVideoClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" borderColor="gray.700">
          <ModalHeader color="white">
            Manage Videos - {selectedCourse?.title}
          </ModalHeader>
          <ModalCloseButton color="gray.300" />
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Existing Videos */}
              {selectedCourse?.videos && selectedCourse.videos.length > 0 && (
                <Box w="full">
                  <Text fontWeight="semibold" color="white" mb={3}>
                    Existing Videos ({selectedCourse.videos.length})
                  </Text>
                  <List spacing={2}>
                    {selectedCourse.videos.sort((a, b) => a.order - b.order).map((video, index) => (
                      <ListItem key={video._id}>
                        <HStack spacing={3} p={3} bg="gray.700" borderRadius="md">
                          <ListIcon as={FiPlay} color="blue.400" />
                          <VStack align="start" spacing={1} flex={1}>
                            <Text color="white" fontWeight="medium">
                              {index + 1}. {video.title}
                            </Text>
                            {typeof video.duration === 'number' && video.duration > 0 && (
                              <Text color="gray.400" fontSize="sm">
                                {Math.floor(video.duration / 60)}m {video.duration % 60}s
                              </Text>
                            )}
                          </VStack>
                          <IconButton
                            size="sm"
                            icon={<FiTrash2 />}
                            colorScheme="red"
                            variant="ghost"
                            aria-label="Delete video"
                            onClick={() => handleDeleteVideo(video._id)}
                          />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <Divider borderColor="gray.600" />

              {/* Add New Video */}
              <Box w="full">
                <Text fontWeight="semibold" color="white" mb={3}>
                  Add New Video
                </Text>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel color="gray.300">Video Title</FormLabel>
                    <Input
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                      placeholder="Enter video title"
                      bg="gray.700"
                      borderColor="gray.600"
                      color="white"
                      _focus={{ borderColor: 'blue.400' }}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300">Description</FormLabel>
                    <Textarea
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                      placeholder="Enter video description"
                      rows={3}
                      bg="gray.700"
                      borderColor="gray.600"
                      color="white"
                      _focus={{ borderColor: 'blue.400' }}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300">Video URL</FormLabel>
                    <Input
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo({...newVideo, videoUrl: e.target.value})}
                      placeholder="https://example.com/video.mp4"
                      bg="gray.700"
                      borderColor="gray.600"
                      color="white"
                      _focus={{ borderColor: 'blue.400' }}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300">Duration (seconds)</FormLabel>
                    <NumberInput
                      value={newVideo.duration}
                      onChange={(value) => setNewVideo({...newVideo, duration: Number(value)})}
                      min={0}
                    >
                      <NumberInputField 
                        placeholder="3600" 
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _focus={{ borderColor: 'blue.400' }}
                      />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300">Order</FormLabel>
                    <NumberInput
                      value={newVideo.order}
                      onChange={(value) => setNewVideo({...newVideo, order: Number(value)})}
                      min={1}
                    >
                      <NumberInputField 
                        placeholder="1" 
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _focus={{ borderColor: 'blue.400' }}
                      />
                    </NumberInput>
                  </FormControl>
                </VStack>
              </Box>
              
              <HStack spacing={4} w="full">
                <Button onClick={onVideoClose} variant="ghost" flex={1} color="gray.300">
                  Close
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleAddVideo}
                  flex={1}
                  isDisabled={!newVideo.title || !newVideo.videoUrl}
                >
                  Add Video
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

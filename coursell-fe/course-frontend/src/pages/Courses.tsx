import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  VStack,
  HStack,
  Flex,
  useToast,
  Skeleton,
  SkeletonText,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { FiSearch, FiStar, FiUsers, FiClock, FiPlay } from 'react-icons/fi';
// import axios from 'axios';
import { getAdminCoursesBulk } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

interface Course {
  id: string;
  _id: string;
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
  creator: string;
  category?: string;
  level?: string;
}

export default function Courses() {
  const { isAdmin } = useContext(AuthContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAdminCoursesBulk();
      setCourses(response.data.courses);
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'music', label: 'Music' },
    { value: 'other', label: 'Other' }
  ];

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" py={12}>
        <Container maxW="7xl">
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={8}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} shadow="lg" borderRadius="xl" overflow="hidden">
                <Skeleton height="200px" />
                <CardBody p={6}>
                  <Skeleton height="24px" mb={2} />
                  <SkeletonText noOfLines={3} mb={4} />
                  <Skeleton height="32px" />
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="7xl" py={8} px={{ base: 2, md: 8 }}>
        {/* Admin Add Course Button */}
        {isAdmin && (
          <Flex justify="flex-end" mb={4}>
            <Button as={RouterLink} to="/admin/create-course" colorScheme="purple" size="md">
              Add Course
            </Button>
          </Flex>
        )}
        {/* Header */}
        <VStack spacing={8} align="stretch">
          <Heading size={{ base: 'lg', md: '2xl' }} color="purple.700" textAlign={{ base: 'center', md: 'left' }}>
            Explore Courses
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Learn from industry experts and master new skills with our comprehensive course collection
          </Text>
        </VStack>

        {/* Filters */}
        <Flex gap={4} mb={8} flexWrap="wrap">
          <InputGroup maxW="400px">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              borderColor="gray.200"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
          </InputGroup>
          
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            bg="white"
            borderColor="gray.200"
            maxW="200px"
            _focus={{ borderColor: 'blue.500' }}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </Flex>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              No courses found matching your criteria
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {filteredCourses.map((course) => (
              <Card
                key={course._id}
                shadow="xl"
                borderRadius="2xl"
                overflow="hidden"
                bg="white"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px)',
                  shadow: '2xl'
                }}
              >
                {/* Course Image */}
                <Box position="relative" height="200px">
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
                    top={3}
                    left={3}
                    colorScheme="green"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    Published
                  </Badge>
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    colorScheme="blue"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    ${course.price}
                  </Badge>
                </Box>

                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    {/* Course Info */}
                    <VStack align="start" spacing={2}>
                      <Heading size="md" color="gray.800" noOfLines={2}>
                        {course.title}
                      </Heading>
                      <Text color="gray.600" fontSize="sm" noOfLines={3}>
                        {course.description}
                      </Text>
                    </VStack>

                    {/* Course Stats */}
                    <HStack spacing={4} color="gray.500" fontSize="sm">
                      <HStack spacing={1}>
                        <Icon as={FiStar} />
                        <Text>4.5</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiUsers} />
                        <Text>1.2k students</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiClock} />
                        <Text>10h</Text>
                      </HStack>
                    </HStack>

                    {/* Course Meta */}
                    <HStack justify="space-between" fontSize="sm">
                      <Badge colorScheme="purple" borderRadius="full" px={2} py={1}>
                        {course.category || 'Programming'}
                      </Badge>
                      <Badge colorScheme="orange" borderRadius="full" px={2} py={1}>
                        {course.level || 'Beginner'}
                      </Badge>
                    </HStack>

                    {/* Action Button */}
                    <Button
                      as={RouterLink}
                      to={`/courses/${course._id}`}
                      colorScheme="blue"
                      size="lg"
                      leftIcon={<FiPlay />}
                      borderRadius="xl"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                      }}
                    >
                      View Course
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
} 
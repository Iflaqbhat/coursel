import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Switch,
  VStack,
  HStack,
  Text,
  useToast,
  Card,
  CardBody,
  Heading,
  Divider,
  Badge,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useState } from 'react';
import VideoForm from './VideoForm';

interface Video {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface CourseFormProps {
  course?: {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    category?: string;
    level?: string;
    videos?: Video[];
  };
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    category: string;
    level: string;
    videos: Video[];
  }) => void;
  isLoading?: boolean;
}

const CourseForm = ({ course, onSubmit, isLoading = false }: CourseFormProps) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    imageLink: course?.imageLink || '',
    published: course?.published || false,
    category: course?.category || 'programming',
    level: course?.level || 'beginner',
  });

  const [videos, setVideos] = useState<Video[]>(course?.videos || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'programming', label: 'Programming', icon: FiBook },
    { value: 'design', label: 'Design', icon: FiImage },
    { value: 'business', label: 'Business', icon: FiDollarSign },
    { value: 'marketing', label: 'Marketing', icon: FiGlobe },
    { value: 'music', label: 'Music', icon: FiBarChart },
    { value: 'other', label: 'Other', icon: FiBook },
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (!formData.imageLink.trim()) {
      newErrors.imageLink = 'Image link is required';
    } else if (!isValidUrl(formData.imageLink)) {
      newErrors.imageLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, published: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      videos,
    });
  };

  const handleVideosChange = (newVideos: Video[]) => {
    setVideos(newVideos);
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="md" mb={2}>
              {course ? 'Edit Course' : 'Create New Course'}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Fill in the details below to {course ? 'update' : 'create'} your course
            </Text>
          </Box>

          <Tabs variant="enclosed" colorScheme="purple">
            <TabList>
              <Tab>Basic Info</Tab>
              <Tab>
                Videos ({videos.length})
                {videos.length > 0 && (
                  <Badge ml={2} colorScheme="purple" variant="solid" fontSize="xs">
                    {videos.length}
                  </Badge>
                )}
              </Tab>
            </TabList>

            <TabPanels>
              {/* Basic Information Tab */}
              <TabPanel>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    {/* Basic Information */}
                    <Box>
                      <Text fontWeight="semibold" mb={3} color="purple.600">
                        Basic Information
                      </Text>
                      <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.title}>
                          <FormLabel>Course Title</FormLabel>
                          <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                            size="lg"
                          />
                          <FormErrorMessage>{errors.title}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.description}>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what students will learn in this course"
                            size="lg"
                            rows={4}
                          />
                          <FormErrorMessage>{errors.description}</FormErrorMessage>
                        </FormControl>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Course Details */}
                    <Box>
                      <Text fontWeight="semibold" mb={3} color="purple.600">
                        Course Details
                      </Text>
                      <VStack spacing={4}>
                        <HStack spacing={4} w="full">
                          <FormControl isInvalid={!!errors.price}>
                            <FormLabel>Price ($)</FormLabel>
                            <Input
                              name="price"
                              type="number"
                              value={formData.price}
                              onChange={handleChange}
                              placeholder="0.00"
                              size="lg"
                            />
                            <FormErrorMessage>{errors.price}</FormErrorMessage>
                          </FormControl>

                          <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              size="lg"
                            >
                              {categories.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </HStack>

                        <HStack spacing={4} w="full">
                          <FormControl>
                            <FormLabel>Difficulty Level</FormLabel>
                            <Select
                              name="level"
                              value={formData.level}
                              onChange={handleChange}
                              size="lg"
                            >
                              {levels.map((level) => (
                                <option key={level.value} value={level.value}>
                                  {level.label}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl>
                            <FormLabel>Course Status</FormLabel>
                            <Flex align="center" h="56px" px={4} bg="gray.50" borderRadius="xl">
                              <Switch
                                name="published"
                                isChecked={formData.published}
                                onChange={handleSwitchChange}
                                colorScheme="purple"
                                size="lg"
                              />
                              <Text ml={3} fontSize="sm" color="gray.600">
                                {formData.published ? 'Published' : 'Draft'}
                              </Text>
                              <Badge
                                ml={2}
                                colorScheme={formData.published ? 'success' : 'gray'}
                                variant="subtle"
                              >
                                {formData.published ? 'Live' : 'Hidden'}
                              </Badge>
                            </Flex>
                          </FormControl>
                        </HStack>
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Media */}
                    <Box>
                      <Text fontWeight="semibold" mb={3} color="purple.600">
                        Course Media
                      </Text>
                      <FormControl isInvalid={!!errors.imageLink}>
                        <FormLabel>Course Image URL</FormLabel>
                        <Input
                          name="imageLink"
                          value={formData.imageLink}
                          onChange={handleChange}
                          placeholder="https://example.com/course-image.jpg"
                          size="lg"
                        />
                        <FormErrorMessage>{errors.imageLink}</FormErrorMessage>
                      </FormControl>
                    </Box>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="lg"
                      isLoading={isLoading}
                      loadingText={course ? 'Updating...' : 'Creating...'}
                      w="full"
                    >
                      {course ? 'Update Course' : 'Create Course'}
                    </Button>
                  </VStack>
                </form>
              </TabPanel>

              {/* Videos Tab */}
              <TabPanel>
                <VideoForm
                  videos={videos}
                  onVideosChange={handleVideosChange}
                  isLoading={isLoading}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default CourseForm;

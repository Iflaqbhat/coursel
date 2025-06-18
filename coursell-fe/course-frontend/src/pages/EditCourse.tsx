import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  useToast,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import CourseForm from "../components/CourseForm";
import { getCourse, updateCourse } from "../services/api";

interface Video {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface Course {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
  category?: string;
  level?: string;
  videos?: Video[];
}

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in as admin to edit courses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/login");
      return;
    }

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getCourse(id!);
        setCourse(response.data.course);
      } catch (err: any) {
        console.error("Fetch course error:", err);
        setError(err.response?.data?.message || 'Failed to load course');
        toast({
          title: 'Error',
          description: 'Failed to load course details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, navigate, token, toast]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
    category: string;
    level: string;
    videos: Array<{
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      order: number;
    }>;
  }) => {
    try {
      await updateCourse(id!, data);
      toast({
        title: 'Success!',
        description: 'Course updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Update course error:", err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update course',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <Center py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="purple.500" />
              <Text color="gray.600">Loading course details...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <Center py={20}>
            <Alert status="error" borderRadius="xl" maxW="md">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">Failed to load course</Text>
                <Text fontSize="sm">{error}</Text>
              </VStack>
            </Alert>
          </Center>
        </Container>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <Center py={20}>
            <Alert status="warning" borderRadius="xl" maxW="md">
              <AlertIcon />
              <Text>Course not found</Text>
            </Alert>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize="sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Edit Course</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" color="purple.600" mb={2}>
              Edit Course
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Update course information and settings
            </Text>
          </Box>

          {/* Form */}
          <CourseForm course={course} onSubmit={handleSubmit} />
        </VStack>
      </Container>
    </Box>
  );
};

export default EditCourse;

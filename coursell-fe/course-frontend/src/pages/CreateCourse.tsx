import { useNavigate } from "react-router-dom";
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
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import CourseForm from "../components/CourseForm";
import { createCourse } from "../services/api";
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in as admin to create courses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/login");
    }
  }, [user, isAdmin, navigate, toast]);

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
    if (!user || !isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in as admin to create courses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/login");
      return;
    }

    try {
      await createCourse(data);
      toast({
        title: 'Success!',
        description: 'Course created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Create course error:", err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create course',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Create Course</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" color="purple.600" mb={2}>
              Create New Course
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Add a new course to your platform and start teaching students
            </Text>
          </Box>

          {/* Form */}
          <CourseForm onSubmit={handleSubmit} />
        </VStack>
      </Container>
    </Box>
  );
};

export default CreateCourse;

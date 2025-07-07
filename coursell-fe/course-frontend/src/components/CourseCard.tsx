import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiPlay, FiShoppingCart } from 'react-icons/fi';

interface CourseCardProps {
  course: {
    id: string;
  title: string;
  description: string;
  price: number;
  imageLink: string;
    published: boolean;
  creator?: string;
    category?: string;
    level?: string;
    rating?: number;
    enrolledStudents?: number;
    duration?: number;
  };
  onPurchase?: (courseId: string) => void;
  isPurchased?: boolean;
  isLoading?: boolean;
}

const CourseCard = ({ course, onPurchase, isPurchased = false, isLoading = false }: CourseCardProps) => {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'programming':
        return 'blue';
      case 'design':
        return 'purple';
      case 'business':
        return 'green';
      case 'marketing':
        return 'orange';
      case 'music':
        return 'pink';
      default:
        return 'gray';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'green';
      case 'intermediate':
        return 'yellow';
      case 'advanced':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(course.id);
    } else {
      toast({
        title: 'Purchase',
        description: 'Purchase functionality not implemented',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        borderColor: 'purple.300',
      }}
      h="full"
      display="flex"
      flexDirection="column"
    >
      {/* Course Image */}
      <Box position="relative" overflow="hidden">
        <Image
          src={course.imageLink || '/fallback-course.png'}
        alt={course.title}
          w="full"
          h="200px"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
        />
        
        {/* Overlay with play button */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          opacity={0}
          transition="opacity 0.3s"
          _groupHover={{ opacity: 1 }}
        >
          <Box
            bg="rgba(0, 0, 0, 0.7)"
            borderRadius="full"
            p={3}
            color="white"
          >
            <Icon as={FiPlay} w={6} h={6} />
          </Box>
        </Box>

        {/* Status Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={course.published ? 'success' : 'gray'}
          variant="solid"
          borderRadius="full"
          px={2}
          py={1}
        >
          {course.published ? 'Live' : 'Draft'}
        </Badge>

        {/* Price Badge */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme="purple"
          variant="solid"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="sm"
          fontWeight="bold"
        >
          ${course.price}
        </Badge>
      </Box>

      <CardBody flex="1" p={6}>
        <VStack align="stretch" spacing={4}>
          {/* Category and Level Badges */}
          <HStack spacing={2} flexWrap="wrap">
            {course.category && (
              <Badge
                colorScheme={getCategoryColor(course.category)}
                variant="subtle"
                fontSize="xs"
                px={2}
                py={1}
              >
                {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
              </Badge>
            )}
            {course.level && (
              <Badge
                colorScheme={getLevelColor(course.level)}
                variant="subtle"
                fontSize="xs"
                px={2}
                py={1}
              >
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </Badge>
            )}
          </HStack>

          {/* Course Title */}
          <Heading size="md" color={textColor} noOfLines={2} lineHeight="1.3">
            {course.title}
          </Heading>

          {/* Course Description */}
          <Text color={subTextColor} fontSize="sm" noOfLines={3} lineHeight="1.5">
            {course.description}
          </Text>

          {/* Course Stats */}
          <VStack spacing={2} align="stretch">
            {/* Rating */}
            {course.rating && (
              <HStack spacing={2} color={subTextColor} fontSize="sm">
                <Icon as={FiStar} color="yellow.400" />
                <Text>{course.rating.toFixed(1)}</Text>
                <Text>•</Text>
                <Text>4.5 (120 reviews)</Text>
              </HStack>
            )}

            {/* Duration and Students */}
            <HStack spacing={4} color={subTextColor} fontSize="sm">
              <HStack spacing={1}>
                <Icon as={FiClock} />
                <Text>{formatDuration(course.duration)}</Text>
              </HStack>
              {course.enrolledStudents && (
                <>
                  <Text>•</Text>
                  <HStack spacing={1}>
                    <Icon as={FiUsers} />
                    <Text>{course.enrolledStudents} students</Text>
                  </HStack>
                </>
              )}
            </HStack>

            {/* Instructor */}
        {course.creator && (
              <Text color={subTextColor} fontSize="sm" fontWeight="medium">
                by {course.creator}
              </Text>
            )}
          </VStack>
        </VStack>
      </CardBody>

      <CardFooter p={6} pt={0}>
        <VStack spacing={3} w="full">
          {isPurchased ? (
            <Button
              as={RouterLink}
              to={`/courses/${course.id}`}
              colorScheme="purple"
              variant="solid"
              w="full"
              leftIcon={<FiPlay />}
            >
              Continue Learning
            </Button>
          ) : (
            <Button
              onClick={handlePurchase}
              colorScheme="purple"
              variant="solid"
              w="full"
              leftIcon={<FiShoppingCart />}
              isLoading={isLoading}
              loadingText="Processing..."
            >
              Enroll Now
            </Button>
          )}
          
          <Button
            as={RouterLink}
            to={`/courses/${course.id}`}
            variant="outline"
            colorScheme="purple"
            w="full"
            size="sm"
          >
            View Details
          </Button>
        </VStack>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;

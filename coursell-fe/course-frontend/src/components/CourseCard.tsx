import {
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiClock, FiPlay, FiShoppingCart, FiStar, FiUsers } from 'react-icons/fi'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    price: number
    imageLink: string
    published: boolean
    creator?: string
    category?: string
    level?: string
    rating?: number
    enrolledStudents?: number
    duration?: number
  }
  onPurchase?: (courseId: string) => void
  isPurchased?: boolean
  isLoading?: boolean
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'N/A'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const CourseCard = ({
  course,
  onPurchase,
  isPurchased = false,
  isLoading = false,
}: CourseCardProps) => {
  const toast = useToast()

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(course.id)
    } else {
      toast({
        title: 'Purchase',
        description: 'Purchase functionality not implemented',
        status: 'info',
        duration: 3000,
      })
    }
  }

  return (
    <Box
      role="group"
      position="relative"
      bg="#0d1117"
      border="1px solid"
      borderColor="rgba(255,255,255,0.07)"
      overflow="hidden"
      h="full"
      display="flex"
      flexDirection="column"
      transition="all .35s"
      _hover={{
        borderColor: 'rgba(0,229,255,0.25)',
        transform: 'translateY(-6px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.45), 0 0 30px rgba(0,229,255,0.06)',
      }}
    >
      <Box position="relative" overflow="hidden" h="200px">
        <Image
          src={course.imageLink || '/fallback-course.png'}
          alt={course.title}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform .4s"
          sx={{ filter: 'brightness(0.85)' }}
          _groupHover={{ transform: 'scale(1.05)' }}
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, rgba(13,17,23,0.95) 0%, transparent 60%)"
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          bg={course.published ? 'rgba(57,211,83,0.12)' : 'rgba(255,255,255,0.06)'}
          color={course.published ? 'green.400' : '#7d8fa3'}
          border="1px solid"
          borderColor={course.published ? 'rgba(57,211,83,0.3)' : 'rgba(255,255,255,0.12)'}
        >
          {course.published ? 'Live' : 'Draft'}
        </Badge>
        <Badge position="absolute" top={3} right={3} bg="brand.500" color="#080b0f">
          ${course.price}
        </Badge>
      </Box>

      <VStack align="stretch" p={6} spacing={4} flex={1}>
        <HStack spacing={2} flexWrap="wrap">
          {course.category && (
            <Badge
              variant="subtle"
              bg="rgba(0,229,255,0.06)"
              color="brand.300"
              border="1px solid"
              borderColor="rgba(0,229,255,0.18)"
            >
              {course.category}
            </Badge>
          )}
          {course.level && (
            <Badge
              variant="subtle"
              bg="rgba(123,97,255,0.08)"
              color="purple.300"
              border="1px solid"
              borderColor="rgba(123,97,255,0.18)"
            >
              {course.level}
            </Badge>
          )}
        </HStack>

        <Heading
          fontFamily="display"
          fontSize="22px"
          fontWeight={400}
          color="white"
          noOfLines={2}
          lineHeight="1.2"
          letterSpacing="0.5px"
        >
          {course.title}
        </Heading>

        <Text color="#7d8fa3" fontSize="13px" noOfLines={3} lineHeight="1.6">
          {course.description}
        </Text>

        <VStack spacing={2} align="stretch" mt="auto">
          <HStack spacing={3} fontSize="11px" color="#7d8fa3" fontFamily="mono">
            {course.rating && (
              <HStack spacing={1}>
                <Icon as={FiStar} color="yellow.400" />
                <Text>{course.rating.toFixed(1)}</Text>
              </HStack>
            )}
            <HStack spacing={1}>
              <Icon as={FiClock} />
              <Text>{formatDuration(course.duration)}</Text>
            </HStack>
            {course.enrolledStudents != null && (
              <HStack spacing={1}>
                <Icon as={FiUsers} />
                <Text>{course.enrolledStudents}</Text>
              </HStack>
            )}
          </HStack>

          {course.creator && (
            <Text color="#7d8fa3" fontSize="11px" fontFamily="mono" letterSpacing="1px">
              BY {course.creator.toUpperCase()}
            </Text>
          )}

          {isPurchased ? (
            <Button
              as={RouterLink}
              to={`/courses/${course.id}`}
              variant="outline"
              leftIcon={<FiPlay />}
              fontFamily="mono"
              fontSize="11px"
              letterSpacing="2px"
              textTransform="uppercase"
              size="sm"
            >
              Continue Learning
            </Button>
          ) : (
            <VStack spacing={2}>
              <Button
                onClick={handlePurchase}
                variant="cyan"
                leftIcon={<FiShoppingCart />}
                isLoading={isLoading}
                loadingText="Processing..."
                w="full"
                size="sm"
                sx={{
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
              >
                Enroll Now
              </Button>
              <Button
                as={RouterLink}
                to={`/courses/${course.id}`}
                variant="outline"
                w="full"
                size="sm"
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="2px"
                textTransform="uppercase"
              >
                View Details
              </Button>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  )
}

export default CourseCard

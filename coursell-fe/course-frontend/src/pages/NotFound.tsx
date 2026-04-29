import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowLeft, FiHome } from 'react-icons/fi'

export default function NotFound() {
  return (
    <Box minH="80vh" py={{ base: 12, md: 20 }}>
      <Container maxW="3xl" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={6}>
          <Box className="section-label">Error 404</Box>
          <Heading
            fontFamily="display"
            fontWeight={400}
            fontSize={{ base: '120px', md: '220px' }}
            lineHeight="0.9"
            color="white"
            letterSpacing="-2px"
          >
            <Box as="span" color="brand.400">404.</Box>
            <Box
              as="span"
              color="transparent"
              sx={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.25)',
              }}
            >
              {' '}LOST?
            </Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm" maxW="lg" lineHeight="1.7">
            The page you're looking for doesn't exist, or has moved. Let's
            get you back on track.
          </Text>
          <HStack spacing={4} flexWrap="wrap">
            <Button
              as={RouterLink}
              to="/"
              variant="cyan"
              leftIcon={<FiHome />}
              sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              Go Home
            </Button>
            <Button
              as={RouterLink}
              to="/courses"
              variant="outline"
              leftIcon={<FiArrowLeft />}
              fontFamily="mono"
              fontSize="12px"
              letterSpacing="2px"
              textTransform="uppercase"
            >
              Browse Courses
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

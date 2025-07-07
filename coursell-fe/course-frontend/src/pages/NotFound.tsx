import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFound() {
  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 8, md: 16 }}>
      <Container maxW="lg" px={{ base: 2, md: 8 }}>
        <VStack spacing={8} align="center" justify="center" h="100%">
          <Heading size={{ base: '2xl', md: '4xl' }} color="purple.700">
            404
          </Heading>
          <Text fontSize={{ base: 'lg', md: '2xl' }} color="gray.600">
            Oops! The page you are looking for does not exist.
          </Text>
          <Button as={RouterLink} to="/" colorScheme="purple" size="lg">
            Go Home
          </Button>
        </VStack>
      </Container>
    </Box>
  )
} 
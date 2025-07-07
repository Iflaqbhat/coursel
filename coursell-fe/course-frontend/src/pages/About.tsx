import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

export default function About() {
  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 8, md: 16 }}>
      <Container maxW="lg" px={{ base: 2, md: 8 }}>
        <VStack spacing={8} align="center" justify="center" h="60vh">
          <Heading size={{ base: 'xl', md: '2xl' }} color="purple.700">
            About Us
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.600" textAlign="center">
            Coursell is dedicated to providing expert-led courses for learners worldwide.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
} 
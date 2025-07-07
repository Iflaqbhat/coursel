import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

export default function Contact() {
  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 8, md: 16 }}>
      <Container maxW="lg" px={{ base: 2, md: 8 }}>
        <VStack spacing={8} align="center" justify="center" h="60vh">
          <Heading size={{ base: 'xl', md: '2xl' }} color="purple.700">
            Contact Us
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.600" textAlign="center">
            Reach out to us at hello@coursell.com or use the form below (coming soon).
          </Text>
        </VStack>
      </Container>
    </Box>
  );
} 
import {
  Box,
  Container,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiCompass, FiHeart, FiLayers, FiZap } from 'react-icons/fi'

const values = [
  {
    icon: FiZap,
    title: 'Project-First',
    description:
      'Real, scoped projects over passive lectures. Every course ends with something you can ship.',
  },
  {
    icon: FiCompass,
    title: 'Honest Pacing',
    description:
      'No filler, no fluff. We respect your time and ship the right amount of content per minute.',
  },
  {
    icon: FiLayers,
    title: 'Modern Stack',
    description:
      'TypeScript, React, Node, MongoDB and friends — focused on what professional teams actually use.',
  },
  {
    icon: FiHeart,
    title: 'Builder Community',
    description:
      'Learn alongside other builders. Share work, get feedback, ship together.',
  },
]

export default function About() {
  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={12}>
          <Box className="section-label">About Coursell</Box>
          <Heading className="section-title">
            BUILT FOR <Box as="span" color="brand.400">BUILDERS</Box>
          </Heading>
        </VStack>

        <Text color="#7d8fa3" fontSize={{ base: 'md', md: 'lg' }} maxW="3xl" mb={14} lineHeight="1.8">
          Coursell is a focused learning platform for developers and creators.
          We believe in fewer, better courses — taught by people who actually
          build software for a living. No filler, just signal.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {values.map((v, i) => (
            <Box
              key={i}
              position="relative"
              p={8}
              bg="#0d1117"
              border="1px solid"
              borderColor="rgba(255,255,255,0.07)"
              transition="all .35s"
              _hover={{
                borderColor: 'rgba(0,229,255,0.25)',
                transform: 'translateY(-6px)',
              }}
            >
              <Text
                position="absolute"
                top="14px"
                right="20px"
                fontFamily="display"
                color="rgba(255,255,255,0.04)"
                fontSize="64px"
                lineHeight={1}
              >
                0{i + 1}
              </Text>
              <HStack spacing={3} mb={4}>
                <Box
                  p={3}
                  bg="rgba(0,229,255,0.08)"
                  border="1px solid"
                  borderColor="rgba(0,229,255,0.15)"
                  borderRadius="md"
                >
                  <Icon as={v.icon} color="brand.400" w={5} h={5} />
                </Box>
                <Heading
                  fontFamily="display"
                  fontSize="26px"
                  fontWeight={400}
                  color="white"
                  letterSpacing="0.5px"
                >
                  {v.title.toUpperCase()}
                </Heading>
              </HStack>
              <Text color="#7d8fa3" fontSize="sm" lineHeight="1.7">
                {v.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

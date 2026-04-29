import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useContext } from 'react'
import {
  FiAward,
  FiBookOpen,
  FiClock,
  FiGlobe,
  FiPlay,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'

const features = [
  {
    icon: FiBookOpen,
    title: 'Expert-Led Content',
    description:
      'Curated courses from industry professionals — taught with depth, not fluff.',
  },
  {
    icon: FiClock,
    title: 'Learn Your Way',
    description:
      'On-demand access, lifetime updates, and a focused, distraction-free player.',
  },
  {
    icon: FiAward,
    title: 'Project-First',
    description:
      'Every course ends with a portfolio-grade project you can actually show off.',
  },
  {
    icon: FiGlobe,
    title: 'Global Community',
    description:
      'Join a community of builders, designers, and engineers shipping real work.',
  },
]

const stats = [
  { label: 'Active Students', value: '10K+', icon: FiUsers },
  { label: 'Expert Instructors', value: '500+', icon: FiAward },
  { label: 'Course Categories', value: '50+', icon: FiBookOpen },
  { label: 'Success Rate', value: '95%', icon: FiTrendingUp },
]

const techChips = [
  'React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Express', 'Next.js',
  'Tailwind', 'Redux', 'Vite', 'Prisma', 'Docker', 'AWS', 'Figma',
]

export default function Home() {
  const { isAdmin } = useContext(AuthContext)

  return (
    <Box minH="100vh">
      {/* HERO */}
      <Box position="relative" pt={{ base: 14, md: 20 }} pb={{ base: 16, md: 24 }}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 480px' }}
            gap={{ base: 12, lg: 0 }}
            alignItems="center"
          >
            {/* LEFT */}
            <VStack align="start" spacing={6}>
              <HStack
                spacing={2}
                px={4}
                py={2}
                border="1px solid"
                borderColor="rgba(57,211,83,0.25)"
                bg="rgba(57,211,83,0.05)"
                fontFamily="mono"
                fontSize="11px"
                color="green.400"
                letterSpacing="1px"
              >
                <Box
                  w="7px"
                  h="7px"
                  borderRadius="50%"
                  bg="green.400"
                  sx={{ animation: 'pulseDot 2s ease infinite' }}
                />
                Available · Live · Building
              </HStack>

              <Text
                fontFamily="mono"
                fontSize="14px"
                color="brand.400"
                letterSpacing="3px"
                textTransform="uppercase"
              >
                // welcome to coursell
              </Text>

              <Heading
                fontFamily="display"
                fontWeight={400}
                fontSize={{ base: '64px', sm: '80px', md: '110px' }}
                lineHeight="0.95"
                letterSpacing="-1px"
                color="white"
              >
                LEARN. <br />
                <Box
                  as="span"
                  color="transparent"
                  sx={{
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.25)',
                    transition: 'all .4s',
                    _hover: {
                      color: '#00e5ff',
                      WebkitTextStroke: '1.5px #00e5ff',
                    },
                  }}
                >
                  BUILD. SHIP.
                </Box>
              </Heading>

              <Text
                fontFamily="mono"
                fontSize={{ base: '14px', md: '17px' }}
                color="#7d8fa3"
                maxW="540px"
                lineHeight="1.8"
              >
                Coursell is a focused learning platform for developers. Master
                modern stacks through{' '}
                <Box as="span" color="brand.400" fontStyle="italic">
                  project-first courses
                </Box>{' '}
                — not endless theory.
              </Text>

              <HStack spacing={4} flexWrap="wrap" pt={2}>
                {isAdmin ? (
                  <Button
                    as={RouterLink}
                    to="/admin/create-course"
                    variant="cyan"
                    leftIcon={<FiPlay />}
                    sx={{
                      clipPath:
                        'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                    }}
                  >
                    Add Course
                  </Button>
                ) : (
                  <>
                    <Button
                      as={RouterLink}
                      to="/courses"
                      variant="cyan"
                      sx={{
                        clipPath:
                          'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                      }}
                    >
                      Browse Courses
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/register"
                      variant="outline"
                      fontFamily="mono"
                      fontSize="12px"
                      letterSpacing="2px"
                      textTransform="uppercase"
                    >
                      Get Started Free
                    </Button>
                  </>
                )}
              </HStack>
            </VStack>

            {/* RIGHT — TERMINAL */}
            <Box
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="rgba(255,255,255,0.12)"
              bg="#0d1117"
              boxShadow="0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.05)"
            >
              <Flex
                bg="#111820"
                px={4}
                py={3}
                borderBottom="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                align="center"
                gap={3}
              >
                <HStack spacing={2}>
                  <Box w="11px" h="11px" borderRadius="50%" bg="#ff5f57" />
                  <Box w="11px" h="11px" borderRadius="50%" bg="#febc2e" />
                  <Box w="11px" h="11px" borderRadius="50%" bg="#28c840" />
                </HStack>
                <Text
                  flex={1}
                  textAlign="center"
                  fontFamily="mono"
                  fontSize="12px"
                  color="#3d4f63"
                  letterSpacing="1px"
                >
                  coursell@dev ~ learning.js
                </Text>
              </Flex>
              <Box p={6} fontFamily="mono" fontSize="13px" lineHeight="1.9">
                <Text>
                  <Box as="span" color="brand.400">❯ </Box>
                  <Box as="span" color="white">node coursell.js</Box>
                </Text>
                <Box h="12px" />
                <Text color="#7d8fa3">
                  <Box as="span" color="purple.400">const</Box>{' '}
                  <Box as="span" color="white">student</Box> = {'{'}
                </Text>
                <Text color="#7d8fa3" pl={4}>
                  goal: <Box as="span" color="#ff9800">"build real apps"</Box>,
                </Text>
                <Text color="#7d8fa3" pl={4}>
                  stack: [
                </Text>
                <Text color="#7d8fa3" pl={8}>
                  <Box as="span" color="#ff9800">"React"</Box>,{' '}
                  <Box as="span" color="#ff9800">"Node.js"</Box>,
                </Text>
                <Text color="#7d8fa3" pl={8}>
                  <Box as="span" color="#ff9800">"TypeScript"</Box>,{' '}
                  <Box as="span" color="#ff9800">"MongoDB"</Box>,
                </Text>
                <Text color="#7d8fa3" pl={4}>
                  ],
                </Text>
                <Text color="#7d8fa3" pl={4}>
                  pace: <Box as="span" color="#ff9800">"your own"</Box>,
                </Text>
                <Text color="#7d8fa3" pl={4}>
                  shipping: <Box as="span" color="green.400">true</Box>,
                </Text>
                <Text color="#7d8fa3">{'}'}</Text>
                <Box h="12px" />
                <Text color="#3d4f63" fontStyle="italic">
                  // Welcome aboard. Let's build.
                  <Box as="span" color="brand.400" sx={{ animation: 'blink 1s step-end infinite' }}>
                    _
                  </Box>
                </Text>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* DIVIDER */}
      <Box
        h="1px"
        mx={{ base: 4, md: 14 }}
        bgGradient="linear(to-r, transparent, rgba(255,255,255,0.1), transparent)"
      />

      {/* STATS */}
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {stats.map((s, i) => (
              <Box
                key={i}
                position="relative"
                p={6}
                bg="#0d1117"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                overflow="hidden"
                _hover={{ borderColor: 'rgba(0,229,255,0.2)', transform: 'translateY(-4px)' }}
                transition="all .3s"
                sx={{
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    bg: 'linear-gradient(90deg, #00e5ff, #7b61ff)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform .4s ease',
                  },
                  '&:hover::before': { transform: 'scaleX(1)' },
                }}
              >
                <Stat>
                  <StatLabel color="#7d8fa3" fontSize="sm">
                    {s.label}
                  </StatLabel>
                  <StatNumber
                    fontFamily="display"
                    color="brand.400"
                    fontSize="52px"
                    fontWeight={400}
                  >
                    {s.value}
                  </StatNumber>
                  <Icon as={s.icon} color="purple.400" w={5} h={5} />
                </Stat>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box py={{ base: 16, md: 24 }} bg="#0d1117">
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <VStack align="start" spacing={3} mb={12}>
            <Box className="section-label">Why Coursell</Box>
            <Heading className="section-title">
              BUILT FOR <Box as="span" color="brand.400">BUILDERS</Box>
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {features.map((f, i) => (
              <Box
                key={i}
                position="relative"
                p={8}
                bg="#080b0f"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                overflow="hidden"
                transition="all .35s"
                _hover={{
                  borderColor: 'rgba(0,229,255,0.25)',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 0 30px rgba(0,229,255,0.05)',
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
                <Box
                  p={3}
                  bg="rgba(0,229,255,0.08)"
                  border="1px solid"
                  borderColor="rgba(0,229,255,0.15)"
                  display="inline-flex"
                  borderRadius="md"
                  mb={5}
                >
                  <Icon as={f.icon} w={6} h={6} color="brand.400" />
                </Box>
                <Heading
                  fontFamily="display"
                  fontSize="28px"
                  fontWeight={400}
                  color="white"
                  mb={3}
                >
                  {f.title.toUpperCase()}
                </Heading>
                <Text color="#7d8fa3" fontSize="sm" lineHeight="1.7">
                  {f.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* TECH MARQUEE */}
      <Box py={{ base: 12, md: 16 }} overflow="hidden" position="relative">
        <Container maxW="7xl" px={{ base: 4, md: 8 }} mb={6}>
          <Box className="section-label">Stacks We Cover</Box>
        </Container>
        <Box
          position="relative"
          sx={{
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '100px',
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
              background: 'linear-gradient(to right, #080b0f, transparent)',
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(to left, #080b0f, transparent)',
            },
          }}
        >
          <Flex
            gap={3}
            sx={{ animation: 'orbitScroll 25s linear infinite' }}
            width="max-content"
          >
            {[...techChips, ...techChips].map((c, i) => (
              <Badge
                key={i}
                px={4}
                py={2}
                fontFamily="mono"
                fontSize="12px"
                color="#7d8fa3"
                bg="transparent"
                border="1px solid"
                borderColor="rgba(255,255,255,0.12)"
                whiteSpace="nowrap"
                _hover={{ color: 'brand.400', borderColor: 'brand.400' }}
                fontWeight="normal"
                textTransform="none"
                letterSpacing="1px"
              >
                {c}
              </Badge>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* CTA */}
      {!isAdmin && (
        <Box py={{ base: 16, md: 24 }} bg="#0d1117">
          <Container maxW="4xl" px={{ base: 4, md: 8 }} textAlign="center">
            <Box className="section-label" mx="auto" justifyContent="center">
              Let's Begin
            </Box>
            <Heading
              fontFamily="display"
              fontWeight={400}
              fontSize={{ base: '52px', md: '110px' }}
              lineHeight="0.9"
              letterSpacing="-1px"
              color="white"
              my={6}
            >
              READY TO <br />
              <Box as="span" color="brand.400">SHIP?</Box>
            </Heading>
            <Text color="#7d8fa3" fontSize="md" lineHeight="1.7" mb={10}>
              Join thousands of learners building real software, day after day.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              variant="cyan"
              leftIcon={<FiZap />}
              size="lg"
              sx={{
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
            >
              Start Learning Now
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  )
}

import { useContext, useState } from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FiLock, FiMail, FiUser, FiZap } from 'react-icons/fi'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

type LocationState = { from?: { pathname?: string; search?: string; hash?: string } }

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)

  const fromState = (location.state as LocationState | null)?.from
  const redirectTo = fromState
    ? `${fromState.pathname || '/'}${fromState.search || ''}${fromState.hash || ''}`
    : '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
        firstName,
        lastName,
        email,
        password,
      })

      const loginRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signin`,
        { email, password }
      )
      const user = {
        id: loginRes.data.userId || loginRes.data.user?.id,
        name: `${firstName} ${lastName}`.trim(),
        email,
        role: 'user',
      }
      login(loginRes.data.token, user)
      toast({
        title: 'Welcome to Coursell',
        description: 'Account created successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed.'
      setError(msg)
      toast({ title: 'Registration failed', description: msg, status: 'error', duration: 5000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" py={{ base: 14, md: 24 }}>
      <Container maxW="md" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={8}>
          <Box className="section-label">Join Coursell</Box>
          <Heading className="section-title">
            CREATE <Box as="span" color="brand.400">ACCOUNT</Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
            Start building real skills today.
          </Text>
        </VStack>

        <Box
          bg="#0d1117"
          border="1px solid"
          borderColor="rgba(255,255,255,0.07)"
          overflow="hidden"
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
              auth ~ register.sh
            </Text>
            <Icon as={FiZap} color="purple.400" />
          </Flex>

          <Box p={{ base: 6, md: 8 }}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={5} align="stretch">
                {error && (
                  <Alert
                    status="error"
                    bg="rgba(255,77,109,0.08)"
                    color="pink.300"
                    border="1px solid"
                    borderColor="rgba(255,77,109,0.3)"
                  >
                    <AlertIcon color="pink.300" />
                    {error}
                  </Alert>
                )}

                <HStack spacing={4} align="start">
                  <FormControl isRequired>
                    <FormLabel
                      fontFamily="mono"
                      fontSize="11px"
                      color="#7d8fa3"
                      letterSpacing="2px"
                      textTransform="uppercase"
                    >
                      First Name
                    </FormLabel>
                    <InputGroup>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Iflaq"
                        size="lg"
                      />
                      <InputRightElement h="full">
                        <Icon as={FiUser} color="#7d8fa3" />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      fontFamily="mono"
                      fontSize="11px"
                      color="#7d8fa3"
                      letterSpacing="2px"
                      textTransform="uppercase"
                    >
                      Last Name
                    </FormLabel>
                    <InputGroup>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Khurshid"
                        size="lg"
                      />
                      <InputRightElement h="full">
                        <Icon as={FiUser} color="#7d8fa3" />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel
                    fontFamily="mono"
                    fontSize="11px"
                    color="#7d8fa3"
                    letterSpacing="2px"
                    textTransform="uppercase"
                  >
                    Email
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@coursell.dev"
                      size="lg"
                    />
                    <InputRightElement h="full">
                      <Icon as={FiMail} color="#7d8fa3" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel
                    fontFamily="mono"
                    fontSize="11px"
                    color="#7d8fa3"
                    letterSpacing="2px"
                    textTransform="uppercase"
                  >
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      size="lg"
                    />
                    <InputRightElement h="full">
                      <HStack spacing={1} pr={1}>
                        <Icon as={FiLock} color="#7d8fa3" />
                        <IconButton
                          aria-label="toggle"
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword((s) => !s)}
                        />
                      </HStack>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  variant="cyan"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating account..."
                  spinner={<Spinner size="sm" />}
                  sx={{
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                >
                  Create Account
                </Button>

                <Box
                  h="1px"
                  bgGradient="linear(to-r, transparent, rgba(255,255,255,0.1), transparent)"
                />

                <Text fontSize="sm" color="#7d8fa3" textAlign="center" fontFamily="mono">
                  Already a member?{' '}
                  <Box
                    as={RouterLink}
                    to="/login"
                    state={fromState ? { from: fromState } : undefined}
                    color="brand.400"
                    fontWeight="bold"
                    _hover={{ color: 'brand.300' }}
                  >
                    SIGN IN →
                  </Box>
                </Text>
              </VStack>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

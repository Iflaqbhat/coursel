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
import { FiLock, FiMail, FiShield } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signin`,
        { email, password }
      )
      const user = {
        id: res.data.userId || res.data.user?.id,
        name: res.data.user?.name || email,
        email,
        role: res.data.user?.role || 'user',
      }
      login(res.data.token, user)
      toast({
        title: 'Welcome back',
        description: 'Successfully signed in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/')
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      setError(msg)
      toast({ title: 'Login failed', description: msg, status: 'error', duration: 5000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" py={{ base: 14, md: 24 }}>
      <Container maxW="md" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={8}>
          <Box className="section-label">Welcome Back</Box>
          <Heading className="section-title">
            SIGN <Box as="span" color="brand.400">IN</Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
            Continue your learning journey.
          </Text>
        </VStack>

        <Box
          bg="#0d1117"
          border="1px solid"
          borderColor="rgba(255,255,255,0.07)"
          overflow="hidden"
        >
          {/* Terminal-style header */}
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
              auth ~ login.sh
            </Text>
            <Icon as={FiShield} color="brand.400" />
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
                      placeholder="••••••••"
                      size="lg"
                    />
                    <InputRightElement h="full">
                      <HStack spacing={1} pr={1}>
                        <Icon as={FiLock} color="#7d8fa3" />
                        <IconButton
                          aria-label={showPassword ? 'Hide' : 'Show'}
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
                  loadingText="Signing in..."
                  spinner={<Spinner size="sm" />}
                  sx={{
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                >
                  Sign In
                </Button>

                <Box
                  h="1px"
                  bgGradient="linear(to-r, transparent, rgba(255,255,255,0.1), transparent)"
                />

                <Text fontSize="sm" color="#7d8fa3" textAlign="center" fontFamily="mono">
                  No account yet?{' '}
                  <Box
                    as={RouterLink}
                    to="/register"
                    color="brand.400"
                    fontWeight="bold"
                    _hover={{ color: 'brand.300' }}
                  >
                    SIGN UP →
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

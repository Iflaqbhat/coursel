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
import { FiKey, FiLock, FiShield, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const adminCredentials = [
  { username: 'admin', password: 'admin123', label: 'Default Admin' },
]

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const fillCredentials = (cred: { username: string; password: string; label: string }) => {
    setUsername(cred.username)
    setPassword(cred.password)
    toast({
      title: `Using ${cred.label} credentials`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/signin`,
        { username, password }
      )
      login(res.data.token, {
        id: res.data.adminId,
        name: username,
        email: '',
        role: 'admin',
      })
      toast({ title: 'Welcome back', description: 'Logged in as admin', status: 'success', duration: 3000, isClosable: true })
      navigate('/admin/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed.'
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
          <Box className="section-label">Admin Portal</Box>
          <Heading className="section-title">
            ADMIN <Box as="span" color="pink.400">ACCESS</Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
            Restricted area · authorized personnel only
          </Text>
        </VStack>

        <Box
          bg="#0d1117"
          border="1px solid"
          borderColor="rgba(255,77,109,0.18)"
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
              admin@coursell ~ login
            </Text>
            <Icon as={FiShield} color="pink.400" />
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

                {/* Quick credentials */}
                <Box>
                  <Text
                    fontFamily="mono"
                    fontSize="11px"
                    color="#7d8fa3"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    mb={3}
                  >
                    Quick Fill
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {adminCredentials.map((c, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="outline"
                        leftIcon={<FiKey />}
                        onClick={() => fillCredentials(c)}
                        fontFamily="mono"
                        fontSize="11px"
                        letterSpacing="1.5px"
                      >
                        {c.label}
                      </Button>
                    ))}
                  </HStack>
                </Box>

                <Box
                  h="1px"
                  bgGradient="linear(to-r, transparent, rgba(255,255,255,0.1), transparent)"
                />

                <FormControl isRequired>
                  <FormLabel
                    fontFamily="mono"
                    fontSize="11px"
                    color="#7d8fa3"
                    letterSpacing="2px"
                    textTransform="uppercase"
                  >
                    Username
                  </FormLabel>
                  <InputGroup>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
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
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Authenticating..."
                  spinner={<Spinner size="sm" />}
                  bg="pink.500"
                  color="white"
                  _hover={{ bg: 'pink.400', transform: 'translateY(-2px)' }}
                  fontFamily="mono"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  fontSize="13px"
                  sx={{
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminLogin

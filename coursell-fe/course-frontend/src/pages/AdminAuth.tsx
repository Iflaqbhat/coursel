import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiShield } from 'react-icons/fi'
import { adminSignIn, adminSignUp } from '../services/api'

const AdminAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate()
  const toast = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await adminSignUp(formData)
        toast({ title: 'Sign up successful', description: 'Please sign in', status: 'success', duration: 3000 })
        setIsSignUp(false)
      } else {
        const res = await adminSignIn(formData)
        localStorage.setItem('adminToken', res.data.token)
        navigate('/admin')
      }
    } catch (err) {
      toast({ title: 'Operation failed', status: 'error', duration: 3000 })
    }
  }

  return (
    <Box minH="100vh" py={{ base: 14, md: 24 }}>
      <Container maxW="md" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={8}>
          <Box className="section-label">Admin</Box>
          <Heading className="section-title">
            {isSignUp ? 'SIGN UP' : 'SIGN IN'}
          </Heading>
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
              admin ~ {isSignUp ? 'register' : 'login'}.sh
            </Text>
            <Icon as={FiShield} color="brand.400" />
          </Flex>
          <Box p={{ base: 6, md: 8 }}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={5} align="stretch">
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
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    size="lg"
                  />
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
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    size="lg"
                  />
                </FormControl>

                <Button
                  type="submit"
                  variant="cyan"
                  w="full"
                  size="lg"
                  sx={{
                    clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>

                <Button
                  variant="link"
                  onClick={() => setIsSignUp((p) => !p)}
                  fontFamily="mono"
                  fontSize="12px"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : 'Need an account? Sign Up'}
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminAuth

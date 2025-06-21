import { useState, useContext } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  useToast,
  Text,
  VStack,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
  Divider,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiShield, FiLock, FiMail } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/signin`, { email, password });
      
      // Create user object from the response
      const user = {
        id: res.data.userId || res.data.user?.id,
        name: res.data.user?.name || email,
        email: email,
        role: res.data.user?.role || 'user'
      };
      
      login(res.data.token, user);
      toast({ 
        title: 'Welcome back!', 
        description: 'Successfully logged in',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast({ 
        title: 'Login failed', 
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <Container maxW="md">
        <Card 
          bg="white" 
          boxShadow="2xl" 
          borderRadius="2xl"
          overflow="hidden"
        >
          {/* Header */}
          <Box 
            bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Box 
                p={3} 
                bg="white" 
                borderRadius="full"
                boxShadow="lg"
              >
                <Icon as={FiShield} w={8} h={8} color="purple.600" />
              </Box>
              <VStack spacing={2}>
                <Heading size="lg" color="white" fontWeight="bold">
                  Sign In
                </Heading>
                <Text color="purple.100" fontSize="sm">
                  Sign in to continue your learning journey
                </Text>
              </VStack>
            </VStack>
          </Box>

          <CardBody p={8}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="medium">
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      size="lg"
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                        bg: 'white'
                      }}
                      _hover={{
                        borderColor: 'gray.300'
                      }}
                    />
                    <InputRightElement>
                      <Icon as={FiMail} color="gray.400" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="medium">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="lg"
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: 'purple.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                        bg: 'white'
                      }}
                      _hover={{
                        borderColor: 'gray.300'
                      }}
                    />
                    <InputRightElement>
                      <HStack spacing={2}>
                        <Icon as={FiLock} color="gray.400" />
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </HStack>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Signing in..."
                  spinner={<Spinner size="sm" />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}
                  _active={{
                    transform: 'translateY(0)'
                  }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>

                <Divider />

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Don't have an account?{' '}
                  <RouterLink to="/register">
                    <Text as="span" color="purple.500" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                      Sign Up Here
                    </Text>
                  </RouterLink>
                </Text>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
} 
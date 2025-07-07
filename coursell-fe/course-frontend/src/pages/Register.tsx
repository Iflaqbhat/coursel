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
import { FiUser, FiMail, FiZap, FiLock } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, { 
        firstName, 
        lastName, 
        email, 
        password 
      });
      
      // Auto-login after successful registration
      const loginRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signin`, { email, password });
      
      const user = {
        id: loginRes.data.userId || loginRes.data.user?.id,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        role: 'user'
      };
      
      login(loginRes.data.token, user);
      toast({ 
        title: '🎉 Welcome to Coursell!', 
        description: 'Your account has been created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast({ 
        title: 'Registration failed', 
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
    <Box minH="100vh" bg="gray.50" py={8}>
      {loading && (
        <Box position="fixed" top={0} left={0} w="100vw" h="100vh" bg="blackAlpha.400" zIndex={2000} display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" color="purple.500" thickness="4px" speed="0.7s" label="Signing up..." />
        </Box>
      )}
      <Container maxW="md" px={{ base: 2, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Heading size={{ base: 'lg', md: 'xl' }} color="purple.600" mb={2}>
              Register
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
              Create your account to get started
            </Text>
          </Box>
          <Box w="full">
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
                    <Icon as={FiZap} w={8} h={8} color="purple.600" />
                  </Box>
                  <VStack spacing={2}>
                    <Heading size="lg" color="white" fontWeight="bold">
                      Join Coursell
                    </Heading>
                    <Text color="purple.100" fontSize="sm">
                      Start your learning journey today
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

                    <HStack spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel color="gray.700" fontWeight="medium">
                          First Name
                        </FormLabel>
                        <InputGroup>
                          <Input
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
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
                            <Icon as={FiUser} color="gray.400" />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="gray.700" fontWeight="medium">
                          Last Name
                        </FormLabel>
                        <InputGroup>
                          <Input
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Enter your last name"
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
                            <Icon as={FiUser} color="gray.400" />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    </HStack>

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
                          placeholder="Create a strong password"
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
                      loadingText="Signing up..."
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
                      Sign Up
                    </Button>

                    <Divider />

                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Already have an account?{' '}
                      <RouterLink to="/login">
                        <Text as="span" color="purple.500" fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                          Sign In Here
                        </Text>
                      </RouterLink>
                    </Text>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 
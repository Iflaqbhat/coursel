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
  Spinner,
  Badge,
  SimpleGrid
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiShield, FiLock, FiUser, FiKey } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Admin credentials
  const adminCredentials = [
    { username: 'admin', password: 'admin123', label: 'Default Admin' }
  ];

  const fillCredentials = (cred: { username: string; password: string; label: string }) => {
    setUsername(cred.username);
    setPassword(cred.password);
    toast({
      title: `Using ${cred.label} credentials`,
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/signin`, { username, password });
      login(res.data.token, { 
        id: res.data.adminId, 
        name: username, 
        email: '', 
        role: 'admin' 
      });
      
      toast({ 
        title: 'Welcome back!', 
        description: 'Successfully logged in as admin',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      navigate('/admin/dashboard');
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
    <Box minH="100vh" bg="gray.900" py={8}>
      {loading && (
        <Box position="fixed" top={0} left={0} w="100vw" h="100vh" bg="blackAlpha.400" zIndex={2000} display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" color="purple.500" thickness="4px" speed="0.7s" label="Signing in..." />
        </Box>
      )}
      <Container maxW="md" px={{ base: 2, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Heading size={{ base: 'lg', md: 'xl' }} color="blue.400" mb={2}>
              Admin Login
            </Heading>
            <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }}>
              Sign in to manage courses and users
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
                    <Icon as={FiShield} w={8} h={8} color="purple.600" />
                  </Box>
                  <VStack spacing={2}>
                    <Heading size="lg" color="white" fontWeight="bold">
                      Admin Portal
                    </Heading>
                    <Text color="purple.100" fontSize="sm">
                      Access your course management dashboard
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

                    {/* Quick Login Buttons */}
                    <Box w="full">
                      <Text fontSize="sm" color="gray.600" mb={3} fontWeight="medium">
                        Quick Login (Click to fill credentials):
                      </Text>
                      <SimpleGrid columns={2} spacing={3}>
                        {adminCredentials.map((cred, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                            leftIcon={<FiKey />}
                            onClick={() => fillCredentials(cred)}
                            _hover={{
                              bg: 'purple.50',
                              borderColor: 'purple.300'
                            }}
                          >
                            <VStack spacing={0} align="start">
                              <Text fontSize="xs" fontWeight="bold">
                                {cred.label}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {cred.username}
                              </Text>
                            </VStack>
                          </Button>
                        ))}
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    <FormControl isRequired>
                      <FormLabel color="gray.700" fontWeight="medium">
                        Username
                      </FormLabel>
                      <InputGroup>
                        <Input
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="admin or ifuubhat72@gmail.com"
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
                        Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="admin123 or iflak@123"
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
                      Sign In to Admin Portal
                    </Button>

                    <Divider />

                    <VStack spacing={2}>
                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        Available Admin Credentials:
                      </Text>
                      <VStack spacing={1} w="full">
                        {adminCredentials.map((cred, index) => (
                          <HStack key={index} w="full" justify="space-between" bg="gray.50" p={2} borderRadius="md">
                            <VStack align="start" spacing={0}>
                              <Badge colorScheme="purple" fontSize="xs">
                                {cred.label}
                              </Badge>
                              <Text fontSize="xs" color="gray.600">
                                {cred.username}
                              </Text>
                            </VStack>
                            <Text fontSize="xs" color="gray.500" fontFamily="mono">
                              {cred.password}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
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

export default AdminLogin;

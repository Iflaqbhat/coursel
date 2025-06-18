import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Card, 
  CardBody, 
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Button,
  Icon,
  useToast,
  Spinner,
  Center,
  Divider,
  Avatar,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave,
  FiShield
} from 'react-icons/fi';
import axios from 'axios';
import { AuthContext, type User } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, login } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    if (user) {
      const nameParts = user.name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user, navigate]);

  // Show loading if user is not yet loaded
  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.600">Loading...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updateData: any = {
        firstName,
        lastName,
        email
      };

      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      await axios.put('/api/user/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the user context with new data
      const updatedUser: User = {
        id: user!.id,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        role: user!.role
      };

      login(token!, updatedUser);

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="4xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading 
              size="2xl" 
              color="gray.800" 
              fontWeight="bold"
              mb={2}
            >
              Profile Settings
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Manage your account information and preferences
            </Text>
          </Box>

          {/* Profile Information */}
          <Card bg="white" boxShadow="lg" borderRadius="xl">
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  borderRadius="xl"
                >
                  <Icon as={FiUser} w={6} h={6} color="white" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">
                    Personal Information
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Update your name and email address
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={6}>
                <HStack spacing={6} w="full">
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
                      placeholder="Enter your email address"
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
              </VStack>
            </CardBody>
          </Card>

          {/* Change Password */}
          <Card bg="white" boxShadow="lg" borderRadius="xl">
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  borderRadius="xl"
                >
                  <Icon as={FiLock} w={6} h={6} color="white" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">
                    Change Password
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Update your password to keep your account secure
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="medium">
                    Current Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
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
                          aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                          icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        />
                      </HStack>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <HStack spacing={6} w="full">
                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="medium">
                      New Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
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
                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                            icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          />
                        </HStack>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="medium">
                      Confirm New Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
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
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          />
                        </HStack>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </HStack>

                {newPassword && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Leave password fields empty if you don't want to change your password
                    </Text>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Account Security */}
          <Card bg="white" boxShadow="lg" borderRadius="xl">
            <CardHeader>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  borderRadius="xl"
                >
                  <Icon as={FiShield} w={6} h={6} color="white" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">
                    Account Security
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    Your account security information
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="start">
                <HStack spacing={4}>
                  <Avatar size="lg" name={user?.name} bg="purple.500" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" color="gray.800">
                      Account Status
                    </Text>
                    <Text color="green.500" fontSize="sm">
                      ✓ Active and secure
                    </Text>
                  </VStack>
                </HStack>
                <Divider />
                <Text fontSize="sm" color="gray.600">
                  Your account is protected with industry-standard security measures. 
                  We recommend changing your password regularly and never sharing your credentials.
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Save Button */}
          <Card bg="white" boxShadow="lg" borderRadius="xl">
            <CardBody>
              <VStack spacing={4}>
                <Button
                  onClick={handleSaveProfile}
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  isLoading={saving}
                  loadingText="Saving changes..."
                  leftIcon={<FiSave />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}
                  _active={{
                    transform: 'translateY(0)'
                  }}
                  transition="all 0.2s"
                >
                  Save Changes
                </Button>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  All changes will be applied immediately to your account
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

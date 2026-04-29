import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FiLock, FiMail, FiSave, FiShield, FiUser } from 'react-icons/fi'
import axios from 'axios'
import { AuthContext, type User } from '../context/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const { user, login } = useContext(AuthContext)
  const toast = useToast()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    const parts = user.name.split(' ')
    setFirstName(parts[0] || '')
    setLastName(parts.slice(1).join(' ') || '')
    setEmail(user.email || '')
  }, [user, navigate])

  if (!user) {
    return (
      <Box minH="100vh">
        <Center h="100vh">
          <VStack>
            <Spinner size="xl" color="brand.400" />
            <Text color="#7d8fa3" fontFamily="mono" letterSpacing="2px" fontSize="12px" textTransform="uppercase">
              Loading...
            </Text>
          </VStack>
        </Center>
      </Box>
    )
  }

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({ title: 'Validation Error', description: 'Please fill all fields', status: 'error', duration: 3000 })
      return
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'Passwords do not match', status: 'error', duration: 3000 })
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const updateData: any = { firstName, lastName, email }
      if (newPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }
      await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated: User = {
        id: user!.id,
        name: `${firstName} ${lastName}`.trim(),
        email,
        role: user!.role,
      }
      login(token!, updated)
      toast({ title: 'Profile Updated', description: 'Your changes are saved', status: 'success', duration: 3000 })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e: any) {
      toast({
        title: 'Update Failed',
        description: e.response?.data?.message || 'Could not update profile',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setSaving(false)
    }
  }

  const PasswordField = ({
    label,
    value,
    onChange,
    show,
    setShow,
    placeholder,
  }: {
    label: string
    value: string
    onChange: (v: string) => void
    show: boolean
    setShow: (v: boolean) => void
    placeholder: string
  }) => (
    <FormControl>
      <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          size="lg"
        />
        <InputRightElement h="full">
          <HStack spacing={1} pr={1}>
            <Icon as={FiLock} color="#7d8fa3" />
            <IconButton
              aria-label="toggle"
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
              size="sm"
              onClick={() => setShow(!show)}
            />
          </HStack>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )

  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="4xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={10} align="stretch">
          <VStack align="start" spacing={3}>
            <Box className="section-label">Settings</Box>
            <Heading className="section-title">
              EDIT <Box as="span" color="brand.400">PROFILE</Box>
            </Heading>
          </VStack>

          {/* PERSONAL */}
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Box p={3} bg="rgba(0,229,255,0.08)" border="1px solid" borderColor="rgba(0,229,255,0.18)" borderRadius="md">
                  <Icon as={FiUser} color="brand.400" w={5} h={5} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" fontFamily="display" fontWeight={400} letterSpacing="0.5px">
                    PERSONAL INFO
                  </Heading>
                  <Text color="#7d8fa3" fontSize="sm">
                    Update your name and email
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={5} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <FormControl isRequired>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      First Name
                    </FormLabel>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} size="lg" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Last Name
                    </FormLabel>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} size="lg" />
                  </FormControl>
                </SimpleGrid>
                <FormControl isRequired>
                  <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                    Email
                  </FormLabel>
                  <InputGroup>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} size="lg" />
                    <InputRightElement h="full">
                      <Icon as={FiMail} color="#7d8fa3" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* PASSWORD */}
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Box p={3} bg="rgba(123,97,255,0.08)" border="1px solid" borderColor="rgba(123,97,255,0.2)" borderRadius="md">
                  <Icon as={FiLock} color="purple.400" w={5} h={5} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" fontFamily="display" fontWeight={400} letterSpacing="0.5px">
                    SECURITY
                  </Heading>
                  <Text color="#7d8fa3" fontSize="sm">
                    Change your password
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={5} align="stretch">
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showCurrent}
                  setShow={setShowCurrent}
                  placeholder="Enter current"
                />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    show={showNew}
                    setShow={setShowNew}
                    placeholder="At least 8 chars"
                  />
                  <PasswordField
                    label="Confirm New"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirm}
                    setShow={setShowConfirm}
                    placeholder="Repeat new"
                  />
                </SimpleGrid>
                {newPassword && (
                  <Alert
                    status="info"
                    bg="rgba(0,229,255,0.06)"
                    color="brand.300"
                    border="1px solid"
                    borderColor="rgba(0,229,255,0.2)"
                  >
                    <AlertIcon color="brand.300" />
                    Leave password fields empty to keep current password
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* ACCOUNT STATUS */}
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Box p={3} bg="rgba(57,211,83,0.08)" border="1px solid" borderColor="rgba(57,211,83,0.2)" borderRadius="md">
                  <Icon as={FiShield} color="green.400" w={5} h={5} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Heading size="md" fontFamily="display" fontWeight={400} letterSpacing="0.5px">
                    ACCOUNT STATUS
                  </Heading>
                  <Text color="#7d8fa3" fontSize="sm">
                    Active and secured
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <HStack spacing={4}>
                <Avatar size="lg" name={user.name} bg="purple.500" color="white" />
                <VStack align="start" spacing={1}>
                  <Text color="white" fontWeight="medium">
                    {user.name}
                  </Text>
                  <HStack color="green.400" fontSize="sm" fontFamily="mono">
                    <Box w="6px" h="6px" borderRadius="50%" bg="green.400" />
                    <Text>Active · Secured</Text>
                  </HStack>
                </VStack>
              </HStack>
              <Divider mt={4} borderColor="rgba(255,255,255,0.07)" />
              <Text color="#7d8fa3" fontSize="sm" mt={4}>
                Your account is protected with industry-standard security. Change your password regularly.
              </Text>
            </CardBody>
          </Card>

          <Button
            onClick={handleSave}
            variant="cyan"
            size="lg"
            isLoading={saving}
            loadingText="Saving..."
            leftIcon={<FiSave />}
            sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            Save Changes
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

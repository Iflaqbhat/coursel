import { useState, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  useColorModeValue,
  useDisclosure,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Container,
  VStack,
  Tooltip
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import { 
  FiBookOpen, 
  FiUser, 
  FiLogOut, 
  FiHome,
  FiPlay,
  FiAward,
  FiZap
} from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'

// Animation keyframes
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(124, 58, 237, 0.5); }
  50% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.8); }
  100% { box-shadow: 0 0 5px rgba(124, 58, 237, 0.5); }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const { user, isAdmin, logout } = useContext(AuthContext)

  const navbarBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverBg = useColorModeValue('purple.50', 'purple.900');
  const purple500 = useColorModeValue('purple.500', 'purple.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box 
      bg={navbarBg}
      backdropFilter="blur(20px)"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)" 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="7xl">
        <Flex
          minH={'80px'}
          py={{ base: 3 }}
          px={{ base: 4 }}
          align={'center'}
          justify={'space-between'}
        >
          {/* Enhanced Logo */}
          <Flex align="center">
            <Box
              as={RouterLink}
              to="/"
              display="flex"
              alignItems="center"
              _hover={{ transform: 'scale(1.05)' }}
              transition="all 0.3s ease"
              position="relative"
            >
              <Box
                p={3}
                bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                borderRadius="xl"
                mr={4}
                boxShadow="lg"
                animation={`${glowAnimation} 3s ease-in-out infinite`}
                _hover={{
                  animation: `${floatAnimation} 2s ease-in-out infinite`,
                  boxShadow: "0 10px 30px rgba(124, 58, 237, 0.4)"
                }}
              >
                <Icon as={FiBookOpen} w={7} h={7} color="white" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text
                  fontSize="3xl"
                  fontWeight="extrabold"
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  bgClip="text"
                  letterSpacing="tight"
                  lineHeight="1"
                >
                  Coursell
                </Text>
              </VStack>
            </Box>
          </Flex>

          {/* Enhanced Desktop Navigation */}
          <Flex display={{ base: 'none', md: 'flex' }} align="center">
            <HStack spacing={8}>
              <Link
                as={RouterLink}
                to="/"
                px={4}
                py={2}
                fontSize="md"
                fontWeight="semibold"
                color={textColor}
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: '0%',
                  height: '2px',
                  bg: purple500,
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)'
                }}
                _hover={{
                  color: purple500,
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.3s ease"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiHome} mr={2} />
                Home
              </Link>
              <Link
                as={RouterLink}
                to="/courses"
                px={4}
                py={2}
                fontSize="md"
                fontWeight="semibold"
                color={textColor}
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: '0%',
                  height: '2px',
                  bg: purple500,
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)'
                }}
                _hover={{
                  color: purple500,
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.3s ease"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiPlay} mr={2} />
                Courses
              </Link>
            </HStack>
          </Flex>

          {/* Enhanced Right Side */}
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={4}
            align="center"
          >
            {!user ? (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  colorScheme="purple"
                  size="md"
                  fontWeight="semibold"
                  fontSize="sm"
                  _hover={{
                    bg: hoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.3s ease"
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="purple"
                  size="md"
                  fontWeight="bold"
                  fontSize="sm"
                  bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
                    bg: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)'
                  }}
                  transition="all 0.3s ease"
                  leftIcon={<FiZap />}
                >
                  Get Started
                </Button>
                <Tooltip label="Admin Access" placement="bottom">
                  <Button
                    as={RouterLink}
                    to="/admin/login"
                    variant="outline"
                    colorScheme="purple"
                    size="md"
                    leftIcon={<FiShield />}
                    fontSize="sm"
                    _hover={{
                      bg: hoverBg,
                      transform: 'translateY(-2px)',
                      borderColor: purple500
                    }}
                    transition="all 0.3s ease"
                  >
                    Admin
                  </Button>
                </Tooltip>
              </>
            ) : (
              <HStack spacing={3}>
                {/* Admin Badge */}
                {isAdmin && (
                  <Badge
                    colorScheme="purple"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                    boxShadow="md"
                    animation={`${glowAnimation} 2s ease-in-out infinite`}
                  >
                    <Icon as={FiAward} mr={1} />
                    ADMIN
                  </Badge>
                )}
                
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                    _hover={{
                      transform: 'scale(1.05)'
                    }}
                    transition="all 0.2s ease"
                  >
                    <Avatar
                      size={'md'}
                      name={user.name}
                      src={user.role === 'admin' ? 'https://via.placeholder.com/150/805ad4/FFFFFF?text=A' : 'https://via.placeholder.com/150/4f46e5/FFFFFF?text=U'}
                      bg={user.role === 'admin' ? 'linear-gradient(135deg, #805ad4 0%, #6b46c1 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'}
                      color="white"
                      boxShadow="md"
                      transition="all 0.2s ease"
                    />
                  </MenuButton>
                  <MenuList
                    bg={cardBg}
                    borderColor={borderColor}
                    boxShadow="xl"
                    borderRadius="xl"
                    py={2}
                  >
                    <MenuItem
                      as={RouterLink}
                      to={'/profile'}
                      icon={<FiUser color={purple500} />}
                      _hover={{ bg: hoverBg }}
                      color={textColor}
                      borderRadius="md"
                      mx={2}
                      mb={1}
                    >
                      My Profile
                    </MenuItem>
                    {user && user.role === 'user' && (
                      <MenuItem
                        as={RouterLink}
                        to={'/dashboard'}
                        icon={<FiBookOpen color={purple500} />}
                        _hover={{ bg: hoverBg }}
                        color={textColor}
                        borderRadius="md"
                        mx={2}
                        mb={1}
                      >
                        My Dashboard
                      </MenuItem>
                    )}
                    {isAdmin && (
                      <MenuItem
                        as={RouterLink}
                        to={'/admin/dashboard'}
                        icon={<FiShield color={purple500} />}
                        _hover={{ bg: hoverBg }}
                        color={textColor}
                        borderRadius="md"
                        mx={2}
                        mb={1}
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuDivider borderColor={borderColor} mx={2} />
                    <MenuItem
                      icon={<FiLogOut color={purple500} />}
                      onClick={logout}
                      _hover={{ bg: hoverBg }}
                      color={textColor}
                      borderRadius="md"
                      mx={2}
                      mt={1}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
                {user && (
                  <IconButton
                    aria-label="Logout"
                    icon={<FiLogOut />}
                    colorScheme="purple"
                    variant="ghost"
                    onClick={logout}
                    ml={2}
                    _hover={{ bg: hoverBg, color: purple500 }}
                    title="Logout"
                  />
                )}
              </HStack>
            )}

            {/* Enhanced Mobile Toggle Button */}
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={5} h={5} color={textColor} />
                ) : (
                  <HamburgerIcon w={5} h={5} color={textColor} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              display={{ md: 'none' }}
              _hover={{ bg: hoverBg, transform: 'scale(1.1)' }}
              transition="all 0.2s ease"
              size="md"
            />
          </Stack>
        </Flex>

        {/* Enhanced Mobile Menu */}
        <Collapse in={isOpen} animateOpacity>
          <Box
            bg={cardBg}
            p={6}
            display={{ md: 'none' }}
            borderTop="1px"
            borderColor={borderColor}
            borderRadius="0 0 2xl 2xl"
            boxShadow="xl"
          >
            <VStack spacing={4} align="stretch">
              <Link
                as={RouterLink}
                to="/"
                py={3}
                px={4}
                fontSize="md"
                fontWeight="semibold"
                color={textColor}
                _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                transition="all 0.2s ease"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiHome} mr={3} />
                Home
              </Link>
              <Link
                as={RouterLink}
                to="/courses"
                py={3}
                px={4}
                fontSize="md"
                fontWeight="semibold"
                color={textColor}
                _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                transition="all 0.2s ease"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiPlay} mr={3} />
                Courses
              </Link>
              {!user ? (
                <>
                  <Link
                    as={RouterLink}
                    to="/login"
                    py={3}
                    px={4}
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                    transition="all 0.2s ease"
                  >
                    Sign In
                  </Link>
                  <Link
                    as={RouterLink}
                    to="/register"
                    py={3}
                    px={4}
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                    transition="all 0.2s ease"
                  >
                    Get Started
                  </Link>
                  <Link
                    as={RouterLink}
                    to="/admin/login"
                    py={3}
                    px={4}
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                    transition="all 0.2s ease"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FiShield} mr={3} />
                    Admin Login
                  </Link>
                </>
              ) : (
                <VStack align="stretch" spacing={2}>
                  <Link
                    as={RouterLink}
                    to={'/profile'}
                    py={3}
                    px={4}
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                    transition="all 0.2s ease"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FiUser} mr={3} />
                    My Profile
                  </Link>
                  {user && user.role === 'user' && (
                    <Link
                      as={RouterLink}
                      to={'/dashboard'}
                      py={3}
                      px={4}
                      fontSize="md"
                      fontWeight="semibold"
                      color={textColor}
                      _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                      transition="all 0.2s ease"
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiBookOpen} mr={3} />
                      My Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      as={RouterLink}
                      to={'/admin/dashboard'}
                      py={3}
                      px={4}
                      fontSize="md"
                      fontWeight="semibold"
                      color={textColor}
                      _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                      transition="all 0.2s ease"
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FiShield} mr={3} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    onClick={logout}
                    py={3}
                    px={4}
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    _hover={{ bg: hoverBg, color: purple500, borderRadius: 'lg' }}
                    transition="all 0.2s ease"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FiLogOut} mr={3} />
                    Logout
                  </Link>
                </VStack>
              )}
            </VStack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  )
}

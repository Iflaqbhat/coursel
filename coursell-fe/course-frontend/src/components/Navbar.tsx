import { useContext, useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  FiAward,
  FiBookOpen,
  FiHome,
  FiLogOut,
  FiPlay,
  FiShield,
  FiUser,
  FiZap,
} from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'

const navItems = [
  { label: 'Home', to: '/', icon: FiHome },
  { label: 'Courses', to: '/courses', icon: FiPlay },
  { label: 'About', to: '/about', icon: FiAward },
  { label: 'Contact', to: '/contact', icon: FiUser },
]

export default function Navbar() {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { user, isAdmin, logout } = useContext(AuthContext)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    setLoadingLogout(true)
    await new Promise((r) => setTimeout(r, 500))
    logout()
    setLoadingLogout(false)
  }

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={500}
      transition="background 0.4s, backdrop-filter 0.4s, border-color 0.4s"
      bg={scrolled ? 'rgba(8,11,15,0.85)' : 'transparent'}
      backdropFilter={scrolled ? 'blur(20px)' : 'none'}
      borderBottom="1px solid"
      borderColor={scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'}
    >
      {loadingLogout && (
        <Box
          position="fixed"
          inset={0}
          bg="rgba(8,11,15,0.7)"
          zIndex={2000}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="brand.400" thickness="3px" speed="0.7s" />
        </Box>
      )}

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <Flex h={{ base: '64px', md: '72px' }} align="center" justify="space-between">
          {/* LOGO */}
          <Link
            as={RouterLink}
            to="/"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ textDecoration: 'none' }}
          >
            <Text
              fontFamily="mono"
              fontSize="14px"
              fontWeight={600}
              color="brand.400"
              letterSpacing="2px"
            >
              COURSE
              <Box as="span" color="#7d8fa3" fontWeight={300}>
                LL.
              </Box>
              <Box as="span" color="white">
                dev
              </Box>
            </Text>
          </Link>

          {/* DESKTOP NAV */}
          <HStack spacing={9} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  as={RouterLink}
                  to={item.to}
                  fontFamily="mono"
                  fontSize="12px"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  fontWeight={500}
                  color={active ? 'brand.400' : '#7d8fa3'}
                  position="relative"
                  _hover={{ color: 'brand.400', textDecoration: 'none' }}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-6px',
                    left: 0,
                    height: '1px',
                    width: active ? '100%' : '0%',
                    bg: 'brand.400',
                    transition: 'width .3s',
                  }}
                  sx={{ '&:hover::after': { width: '100%' } }}
                >
                  {item.label}
                </Link>
              )
            })}
          </HStack>

          {/* RIGHT SIDE */}
          <HStack spacing={3}>
            {!user ? (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  fontFamily="mono"
                  fontSize="12px"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  display={{ base: 'none', md: 'inline-flex' }}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  variant="cyan"
                  size="sm"
                  display={{ base: 'none', md: 'inline-flex' }}
                  rightIcon={<Icon as={FiZap} />}
                  sx={{
                    clipPath:
                      'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                  }}
                >
                  Get Started
                </Button>
                <Tooltip label="Admin Access" placement="bottom">
                  <Button
                    as={RouterLink}
                    to="/admin/login"
                    variant="outline"
                    size="sm"
                    leftIcon={<FiShield />}
                    fontFamily="mono"
                    fontSize="11px"
                    letterSpacing="1.5px"
                    display={{ base: 'none', md: 'inline-flex' }}
                  >
                    Admin
                  </Button>
                </Tooltip>
              </>
            ) : (
              <HStack spacing={3}>
                {isAdmin && (
                  <Badge
                    bg="rgba(255,77,109,0.12)"
                    color="pink.400"
                    border="1px solid"
                    borderColor="rgba(255,77,109,0.35)"
                    display={{ base: 'none', sm: 'inline-flex' }}
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FiShield} /> Admin
                  </Badge>
                )}
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="ghost"
                    cursor="pointer"
                    minW={0}
                    p={1}
                    _hover={{ bg: 'rgba(0,229,255,0.06)' }}
                  >
                    <Avatar
                      size="sm"
                      name={user.name}
                      bg="purple.500"
                      color="white"
                    />
                  </MenuButton>
                  <MenuList borderRadius="md" minW="220px">
                    <MenuItem as={RouterLink} to="/profile" icon={<FiUser />}>
                      My Profile
                    </MenuItem>
                    {user.role === 'user' && (
                      <MenuItem
                        as={RouterLink}
                        to="/dashboard"
                        icon={<FiBookOpen />}
                      >
                        Dashboard
                      </MenuItem>
                    )}
                    {isAdmin && (
                      <MenuItem
                        as={RouterLink}
                        to="/admin/dashboard"
                        icon={<FiShield />}
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuDivider borderColor="rgba(255,255,255,0.08)" />
                    <MenuItem onClick={handleLogout} icon={<FiLogOut />}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            )}

            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant="ghost"
              aria-label="Toggle Navigation"
              display={{ md: 'none' }}
              size="sm"
            />
          </HStack>
        </Flex>

        {/* MOBILE MENU */}
        <Collapse in={isOpen} animateOpacity>
          <Box
            display={{ md: 'none' }}
            pb={4}
            pt={2}
            borderTop="1px solid"
            borderColor="rgba(255,255,255,0.07)"
          >
            <VStack align="stretch" spacing={1}>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  as={RouterLink}
                  to={item.to}
                  onClick={onClose}
                  px={4}
                  py={3}
                  fontFamily="mono"
                  fontSize="12px"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  color="#7d8fa3"
                  _hover={{ color: 'brand.400', bg: 'rgba(0,229,255,0.05)' }}
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <Icon as={item.icon} /> {item.label}
                </Link>
              ))}
              {!user ? (
                <VStack align="stretch" spacing={2} pt={2}>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                    onClick={onClose}
                    fontFamily="mono"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    fontSize="12px"
                  >
                    Sign In
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    variant="cyan"
                    onClick={onClose}
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/admin/login"
                    variant="outline"
                    onClick={onClose}
                    leftIcon={<FiShield />}
                    fontFamily="mono"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    fontSize="11px"
                  >
                    Admin
                  </Button>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={2} pt={2}>
                  <Button
                    as={RouterLink}
                    to="/profile"
                    variant="ghost"
                    onClick={onClose}
                    leftIcon={<FiUser />}
                  >
                    Profile
                  </Button>
                  {user.role === 'user' && (
                    <Button
                      as={RouterLink}
                      to="/dashboard"
                      variant="ghost"
                      onClick={onClose}
                      leftIcon={<FiBookOpen />}
                    >
                      Dashboard
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      as={RouterLink}
                      to="/admin/dashboard"
                      variant="ghost"
                      onClick={onClose}
                      leftIcon={<FiShield />}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      onClose()
                      handleLogout()
                    }}
                    variant="outline"
                    leftIcon={<FiLogOut />}
                  >
                    Logout
                  </Button>
                </VStack>
              )}
            </VStack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  )
}

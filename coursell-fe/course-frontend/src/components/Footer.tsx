import {
  Box,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import {
  FiFacebook,
  FiGithub,
  FiHeart,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: 'Browse Courses', href: '/courses' },
      { name: 'Learning Paths', href: '/courses' },
      { name: 'Certificates', href: '/courses' },
      { name: 'Live Sessions', href: '/courses' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Help', href: '/help' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: FiGithub, href: 'https://github.com' },
  ]

  return (
    <Box
      as="footer"
      bg="#0d1117"
      borderTop="1px solid"
      borderColor="rgba(255,255,255,0.07)"
      mt={16}
    >
      <Container maxW="7xl" py={14} px={{ base: 4, md: 8 }}>
        <Stack spacing={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <VStack align="start" spacing={4}>
              <Text
                fontFamily="mono"
                fontSize="14px"
                letterSpacing="2px"
                color="brand.400"
              >
                COURSE
                <Box as="span" color="#7d8fa3" fontWeight={300}>
                  LL.
                </Box>
                <Box as="span" color="white">
                  dev
                </Box>
              </Text>
              <Text color="#7d8fa3" fontSize="sm" lineHeight="1.7">
                A premium learning platform for developers and creators.
                Curated courses, real projects, and a focused learning
                experience.
              </Text>
              <VStack align="start" spacing={2}>
                <HStack color="#7d8fa3" fontSize="sm" spacing={2}>
                  <Icon as={FiMail} color="brand.400" />
                  <Text>hello@coursell.dev</Text>
                </HStack>
                <HStack color="#7d8fa3" fontSize="sm" spacing={2}>
                  <Icon as={FiPhone} color="brand.400" />
                  <Text>+91 6005 154 365</Text>
                </HStack>
                <HStack color="#7d8fa3" fontSize="sm" spacing={2}>
                  <Icon as={FiMapPin} color="brand.400" />
                  <Text>Kashmir, India</Text>
                </HStack>
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading
                size="sm"
                fontFamily="mono"
                color="purple.300"
                letterSpacing="3px"
                textTransform="uppercase"
              >
                Platform
              </Heading>
              <VStack align="start" spacing={2}>
                {footerLinks.platform.map((l) => (
                  <Link
                    key={l.name}
                    as={RouterLink}
                    to={l.href}
                    color="#7d8fa3"
                    fontSize="sm"
                    _hover={{ color: 'brand.400' }}
                  >
                    {l.name}
                  </Link>
                ))}
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading
                size="sm"
                fontFamily="mono"
                color="purple.300"
                letterSpacing="3px"
                textTransform="uppercase"
              >
                Company
              </Heading>
              <VStack align="start" spacing={2}>
                {footerLinks.company.map((l) => (
                  <Link
                    key={l.name}
                    as={RouterLink}
                    to={l.href}
                    color="#7d8fa3"
                    fontSize="sm"
                    _hover={{ color: 'brand.400' }}
                  >
                    {l.name}
                  </Link>
                ))}
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading
                size="sm"
                fontFamily="mono"
                color="purple.300"
                letterSpacing="3px"
                textTransform="uppercase"
              >
                Stay Updated
              </Heading>
              <Text color="#7d8fa3" fontSize="sm">
                New courses every month. No spam, ever.
              </Text>
              <HStack spacing={3}>
                {socialLinks.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    isExternal
                    color="#7d8fa3"
                    p={2}
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.12)"
                    borderRadius="md"
                    _hover={{ color: 'brand.400', borderColor: 'brand.400' }}
                  >
                    <Icon as={s.icon} w={4} h={4} />
                  </Link>
                ))}
              </HStack>
            </VStack>
          </SimpleGrid>

          <Divider borderColor="rgba(255,255,255,0.07)" />

          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={3}
          >
            <Text fontSize="xs" color="#3d4f63" fontFamily="mono" letterSpacing="1px">
              © {currentYear} COURSELL · ALL RIGHTS RESERVED
            </Text>
            <HStack spacing={2} color="#7d8fa3" fontSize="xs">
              <Text>Crafted with</Text>
              <Icon as={FiHeart} color="pink.400" />
              <Text>from Kashmir</Text>
            </HStack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Divider,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiGithub,
  FiHeart
} from 'react-icons/fi';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.800', 'white');

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Courses', href: '/courses' },
      { name: 'Learning Paths', href: '/learning-paths' },
      { name: 'Certificates', href: '/certificates' },
      { name: 'Live Sessions', href: '/live-sessions' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Partners', href: '/partners' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Community', href: '/community' },
      { name: 'Events', href: '/events' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: FiGithub, href: 'https://github.com' },
  ];

  return (
    <Box bg={bgColor} borderTop="1px solid" borderColor={borderColor}>
      <Container maxW="7xl" py={12}>
        <Stack spacing={8}>
          {/* Main Footer Content */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={8}>
            {/* Brand Section */}
            <VStack align="start" spacing={4}>
              <Heading size="lg" color="purple.600">
                Coursell
              </Heading>
              <Text color={textColor} fontSize="sm" lineHeight="1.6">
                Transform your career with expert-led courses. Learn at your own pace 
                and unlock your full potential with our comprehensive learning platform.
              </Text>
              
              {/* Contact Info */}
              <VStack align="start" spacing={2}>
                <HStack spacing={2} color={textColor} fontSize="sm">
                  <Icon as={FiMail} />
                  <Text>hello@coursell.com</Text>
                </HStack>
                <HStack spacing={2} color={textColor} fontSize="sm">
                  <Icon as={FiPhone} />
                  <Text>+1 (555) 123-4567</Text>
                </HStack>
                <HStack spacing={2} color={textColor} fontSize="sm">
                  <Icon as={FiMapPin} />
                  <Text>San Francisco, CA</Text>
                </HStack>
              </VStack>
            </VStack>

            {/* Platform Links */}
            <VStack align="start" spacing={4}>
              <Heading size="md" color={headingColor}>
                Platform
              </Heading>
              <VStack align="start" spacing={2}>
                {footerLinks.platform.map((link) => (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.href}
                    color={textColor}
                    fontSize="sm"
                    _hover={{ color: 'purple.500', textDecoration: 'none' }}
                    transition="color 0.2s"
                  >
                    {link.name}
                  </Link>
                ))}
              </VStack>
            </VStack>

            {/* Company Links */}
            <VStack align="start" spacing={4}>
              <Heading size="md" color={headingColor}>
                Company
              </Heading>
              <VStack align="start" spacing={2}>
                {footerLinks.company.map((link) => (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.href}
                    color={textColor}
                    fontSize="sm"
                    _hover={{ color: 'purple.500', textDecoration: 'none' }}
                    transition="color 0.2s"
                  >
                    {link.name}
          </Link>
                ))}
              </VStack>
            </VStack>

            {/* Support Links */}
            <VStack align="start" spacing={4}>
              <Heading size="md" color={headingColor}>
                Support
              </Heading>
              <VStack align="start" spacing={2}>
                {footerLinks.support.map((link) => (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.href}
                    color={textColor}
                    fontSize="sm"
                    _hover={{ color: 'purple.500', textDecoration: 'none' }}
                    transition="color 0.2s"
                  >
                    {link.name}
          </Link>
                ))}
              </VStack>
            </VStack>

            {/* Resources Links */}
            <VStack align="start" spacing={4}>
              <Heading size="md" color={headingColor}>
                Resources
              </Heading>
              <VStack align="start" spacing={2}>
                {footerLinks.resources.map((link) => (
                  <Link
                    key={link.name}
                    as={RouterLink}
                    to={link.href}
                    color={textColor}
                    fontSize="sm"
                    _hover={{ color: 'purple.500', textDecoration: 'none' }}
                    transition="color 0.2s"
                  >
                    {link.name}
          </Link>
                ))}
              </VStack>
            </VStack>
          </SimpleGrid>

          <Divider borderColor={borderColor} />

          {/* Bottom Section */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
            spacing={4}
          >
            {/* Copyright */}
            <Text color={textColor} fontSize="sm">
              © {currentYear} Coursell. All rights reserved.
            </Text>

            {/* Social Links */}
            <HStack spacing={4}>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  isExternal
                  color={textColor}
                  _hover={{ color: 'purple.500' }}
                  transition="color 0.2s"
                  aria-label={social.name}
                >
                  <Icon as={social.icon} w={5} h={5} />
          </Link>
              ))}
            </HStack>
          </Stack>

          {/* Made with Love */}
          <Box textAlign="center" pt={4}>
            <Text color={textColor} fontSize="xs">
              Made with <Icon as={FiHeart} color="red.400" /> by the Coursell team
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 
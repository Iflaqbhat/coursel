import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiBook, FiCreditCard, FiHelpCircle, FiUsers } from 'react-icons/fi'

const categories = [
  { icon: FiHelpCircle, label: 'Getting Started' },
  { icon: FiBook, label: 'Courses & Content' },
  { icon: FiCreditCard, label: 'Billing & Refunds' },
  { icon: FiUsers, label: 'Account & Settings' },
]

const faqs = [
  {
    q: 'How do I purchase a course?',
    a: 'Browse the catalog, open any course, and click Buy Now. After purchase, the course unlocks immediately under My Library.',
  },
  {
    q: 'Do courses include lifetime access?',
    a: 'Yes — every purchased course includes lifetime access including all future content updates.',
  },
  {
    q: 'Can I get a refund?',
    a: 'We offer a 30-day money-back guarantee on every course purchase, no questions asked.',
  },
  {
    q: 'Where can I update my profile information?',
    a: 'Click your avatar (top right), go to Profile, and update your details.',
  },
  {
    q: 'How do I get certified?',
    a: 'Complete all videos in a course and download your certificate from the course page.',
  },
]

export default function Help() {
  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="5xl" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={12}>
          <Box className="section-label">Help Center</Box>
          <Heading className="section-title">
            HOW CAN WE <Box as="span" color="brand.400">HELP?</Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
            Browse common questions or reach us via the contact page.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={14}>
          {categories.map((c, i) => (
            <Box
              key={i}
              p={6}
              bg="#0d1117"
              border="1px solid"
              borderColor="rgba(255,255,255,0.07)"
              textAlign="center"
              transition="all .3s"
              _hover={{ borderColor: 'rgba(0,229,255,0.25)', transform: 'translateY(-4px)' }}
            >
              <Icon as={c.icon} w={6} h={6} color="brand.400" mb={3} />
              <Text fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                {c.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <HStack mb={6} spacing={4}>
          <Box
            h="1px"
            flex={1}
            bgGradient="linear(to-r, transparent, rgba(255,255,255,0.1), transparent)"
          />
          <Text
            fontFamily="mono"
            fontSize="11px"
            color="brand.400"
            letterSpacing="3px"
            textTransform="uppercase"
          >
            FAQ
          </Text>
          <Box
            h="1px"
            flex={1}
            bgGradient="linear(to-r, transparent, rgba(255,255,255,0.1), transparent)"
          />
        </HStack>

        <Accordion allowMultiple>
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              border="1px solid"
              borderColor="rgba(255,255,255,0.07)"
              bg="#0d1117"
              mb={3}
            >
              <h2>
                <AccordionButton
                  py={5}
                  _expanded={{ color: 'brand.400' }}
                  _hover={{ bg: 'rgba(0,229,255,0.04)' }}
                >
                  <Box flex="1" textAlign="left" fontFamily="mono" fontSize="14px" letterSpacing="0.5px">
                    {f.q}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={5} color="#7d8fa3" fontSize="sm" lineHeight="1.7">
                {f.a}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  )
}

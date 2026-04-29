import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: 'Message sent',
        description: "We'll get back to you within 24h",
        status: 'success',
        duration: 4000,
      })
      setForm({ name: '', email: '', message: '' })
    }, 700)
  }

  const channels = [
    { icon: FiMail, label: 'Email', value: 'hello@coursell.dev' },
    { icon: FiPhone, label: 'Phone', value: '+91 6005 154 365' },
    { icon: FiMapPin, label: 'Location', value: 'Kashmir, India' },
  ]

  return (
    <Box minH="100vh" py={{ base: 12, md: 20 }}>
      <Container maxW="6xl" px={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={3} mb={12}>
          <Box className="section-label">Let's Talk</Box>
          <Heading className="section-title">
            GET IN <Box as="span" color="brand.400">TOUCH</Box>
          </Heading>
          <Text color="#7d8fa3" fontFamily="mono" fontSize="sm">
            Questions, ideas, partnerships — we'd love to hear from you.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <VStack align="stretch" spacing={5}>
            {channels.map((c, i) => (
              <Box
                key={i}
                p={6}
                bg="#0d1117"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                transition="all .3s"
                _hover={{ borderColor: 'rgba(0,229,255,0.25)' }}
              >
                <HStack spacing={4}>
                  <Box
                    p={3}
                    bg="rgba(0,229,255,0.08)"
                    border="1px solid"
                    borderColor="rgba(0,229,255,0.15)"
                    borderRadius="md"
                  >
                    <Icon as={c.icon} color="brand.400" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      {c.label}
                    </Text>
                    <Text color="white" fontFamily="mono" fontSize="sm">
                      {c.value}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Box
            bg="#0d1117"
            border="1px solid"
            borderColor="rgba(255,255,255,0.07)"
            overflow="hidden"
          >
            <Flex
              bg="#111820"
              px={4}
              py={3}
              borderBottom="1px solid"
              borderColor="rgba(255,255,255,0.07)"
              align="center"
              gap={3}
            >
              <HStack spacing={2}>
                <Box w="11px" h="11px" borderRadius="50%" bg="#ff5f57" />
                <Box w="11px" h="11px" borderRadius="50%" bg="#febc2e" />
                <Box w="11px" h="11px" borderRadius="50%" bg="#28c840" />
              </HStack>
              <Text
                flex={1}
                textAlign="center"
                fontFamily="mono"
                fontSize="12px"
                color="#3d4f63"
                letterSpacing="1px"
              >
                contact ~ message.sh
              </Text>
            </Flex>

            <Box p={6}>
              <form onSubmit={onSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Name
                    </FormLabel>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      size="lg"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@domain.com"
                      size="lg"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Message
                    </FormLabel>
                    <Textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="What's on your mind?"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="cyan"
                    leftIcon={<FiSend />}
                    isLoading={loading}
                    loadingText="Sending..."
                    sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

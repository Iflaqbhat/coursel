import { useContext, useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  Grid,
  HStack,
  Heading,
  Icon,
  Image,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiLock,
  FiPlay,
  FiShield,
  FiStar,
  FiUsers,
  FiVideo,
} from 'react-icons/fi'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

interface Video {
  _id: string
  title: string
  description: string
  videoUrl: string
  duration?: number
  order: number
}

interface Course {
  _id: string
  title: string
  description: string
  price: number
  imageLink: string
  published: boolean
  createdAt: string
  enrolledStudents?: string[]
  rating?: number
  content?: string
  videos?: Video[]
  category?: string
  level?: string
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)
  return match ? match[1] : null
}

export default function CourseDetails() {
  const { id } = useParams()
  const { user, isAdmin } = useContext(AuthContext)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([])
  const [videoLoading, setVideoLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCourse()
      fetchRelated()
    }
  }, [id, user])

  const fetchCourse = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const userToken = localStorage.getItem('token')
      const headers = adminToken
        ? { Authorization: `Bearer ${adminToken}` }
        : userToken
        ? { Authorization: `Bearer ${userToken}` }
        : {}
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, { headers })
      setCourse(response.data.course)
      setHasAccess(response.data.hasAccess || (adminToken ? true : false))
    } catch (e) {
      toast({ title: 'Error fetching course', status: 'error', duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const fetchRelated = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`)
      setRelatedCourses(response.data.filter((c: Course) => c._id !== id))
    } catch {
      // ignore
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      toast({ title: 'Please sign in', status: 'warning', duration: 3000 })
      return
    }
    setPurchasing(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/purchase/course/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      toast({
        title: 'Course purchased',
        description: 'Lifetime access unlocked',
        status: 'success',
        duration: 4000,
      })
      fetchCourse()
      onClose()
    } catch (e: any) {
      toast({
        title: 'Purchase failed',
        description: e.response?.data?.message || 'Try again',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setPurchasing(false)
    }
  }

  const openPurchase = () => {
    if (!user) {
      toast({ title: 'Please sign in to purchase', status: 'warning', duration: 3000 })
      return
    }
    onOpen()
  }

  if (loading) {
    return (
      <Box minH="100vh" py={20}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            <VStack align="stretch" spacing={6}>
              <Skeleton height="400px" startColor="#111820" endColor="#1a2330" />
              <Skeleton height="32px" startColor="#111820" endColor="#1a2330" />
              <SkeletonText noOfLines={4} startColor="#111820" endColor="#1a2330" />
            </VStack>
            <Skeleton height="400px" startColor="#111820" endColor="#1a2330" />
          </Grid>
        </Container>
      </Box>
    )
  }

  if (!course) {
    return (
      <Box minH="100vh" py={20}>
        <Container maxW="3xl" px={{ base: 4, md: 8 }}>
          <Alert
            status="error"
            bg="rgba(255,77,109,0.08)"
            color="pink.300"
            border="1px solid"
            borderColor="rgba(255,77,109,0.3)"
          >
            <AlertIcon color="pink.300" />
            Course not found.
          </Alert>
        </Container>
      </Box>
    )
  }

  const features = [
    { icon: FiBookOpen, label: 'Lifetime Access', value: 'Yes' },
    { icon: FiClock, label: 'Duration', value: '10+ hours' },
    { icon: FiUsers, label: 'Students', value: `${course.enrolledStudents?.length || 0}` },
    { icon: FiStar, label: 'Rating', value: `${course.rating || 4.5}/5` },
  ]

  return (
    <Box minH="100vh" py={{ base: 8, md: 16 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack align="stretch" spacing={6}>
          <Button
            as={RouterLink}
            to="/courses"
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            alignSelf="flex-start"
            fontFamily="mono"
            fontSize="11px"
            letterSpacing="2px"
            textTransform="uppercase"
          >
            Back to Courses
          </Button>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            <VStack align="stretch" spacing={6}>
              {/* HERO IMAGE */}
              <Box
                position="relative"
                h="400px"
                overflow="hidden"
                bg="#0d1117"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
              >
                <Image
                  src={course.imageLink || '/fallback-course.png'}
                  alt={course.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  fallbackSrc="/fallback-course.png"
                  sx={{ filter: 'brightness(0.8)' }}
                />
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-t, rgba(13,17,23,0.95) 0%, transparent 50%)"
                />
                <Badge
                  position="absolute"
                  top={4}
                  left={4}
                  bg="rgba(0,229,255,0.12)"
                  color="brand.300"
                  border="1px solid"
                  borderColor="rgba(0,229,255,0.3)"
                >
                  {course.category || 'Development'}
                </Badge>
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  bg="rgba(123,97,255,0.18)"
                  color="purple.300"
                  border="1px solid"
                  borderColor="rgba(123,97,255,0.35)"
                >
                  {course.level || 'Beginner'}
                </Badge>
              </Box>

              {/* INFO */}
              <Card>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Heading
                      fontFamily="display"
                      fontWeight={400}
                      fontSize={{ base: '36px', md: '48px' }}
                      color="white"
                      letterSpacing="0.5px"
                      lineHeight="1"
                    >
                      {course.title.toUpperCase()}
                    </Heading>
                    <Text color="#7d8fa3" fontSize="md" lineHeight="1.7">
                      {course.description}
                    </Text>
                    <Divider borderColor="rgba(255,255,255,0.07)" />
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      {features.map((f, i) => (
                        <HStack key={i} spacing={3}>
                          <Box
                            p={2}
                            bg="rgba(0,229,255,0.06)"
                            border="1px solid"
                            borderColor="rgba(0,229,255,0.15)"
                            borderRadius="md"
                          >
                            <Icon as={f.icon} color="brand.400" />
                          </Box>
                          <VStack align="start" spacing={0}>
                            <Text fontFamily="mono" fontSize="10px" color="#7d8fa3" letterSpacing="1.5px" textTransform="uppercase">
                              {f.label}
                            </Text>
                            <Text color="white" fontSize="sm">
                              {f.value}
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>

              {/* CONTENT / VIDEOS */}
              <Card>
                <CardHeader>
                  <Heading fontFamily="display" fontWeight={400} fontSize="24px" letterSpacing="0.5px">
                    COURSE CONTENT
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  {!hasAccess && (
                    <HStack mb={4}>
                      <Icon as={FiLock} color="pink.400" />
                      <Text color="pink.300" fontSize="sm">
                        Purchase this course to unlock all videos.
                      </Text>
                    </HStack>
                  )}

                  <List spacing={2}>
                    {course.videos && course.videos.length > 0 ? (
                      course.videos
                        .sort((a, b) => a.order - b.order)
                        .map((video, idx) => (
                          <ListItem key={video._id}>
                            <HStack
                              p={3}
                              bg={
                                selectedVideo?._id === video._id
                                  ? 'rgba(0,229,255,0.08)'
                                  : 'rgba(255,255,255,0.03)'
                              }
                              border="1px solid"
                              borderColor={
                                selectedVideo?._id === video._id
                                  ? 'rgba(0,229,255,0.3)'
                                  : 'rgba(255,255,255,0.06)'
                              }
                              borderRadius="md"
                              cursor={hasAccess ? 'pointer' : 'not-allowed'}
                              transition="all .2s"
                              _hover={hasAccess ? { borderColor: 'rgba(0,229,255,0.25)' } : {}}
                              onClick={() => {
                                if (hasAccess) {
                                  setVideoLoading(true)
                                  setSelectedVideo(video)
                                }
                              }}
                            >
                              <Text
                                color="#3d4f63"
                                fontFamily="display"
                                fontSize="20px"
                                w="32px"
                                textAlign="center"
                              >
                                {String(idx + 1).padStart(2, '0')}
                              </Text>
                              <Icon
                                as={hasAccess ? FiPlay : FiLock}
                                color={hasAccess ? 'brand.400' : 'pink.400'}
                              />
                              <VStack align="start" spacing={0} flex={1}>
                                <Text color="white" fontSize="sm" fontWeight={500}>
                                  {video.title}
                                </Text>
                                {video.description && (
                                  <Text color="#7d8fa3" fontSize="xs" noOfLines={1}>
                                    {video.description}
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                          </ListItem>
                        ))
                    ) : (
                      <Text color="#7d8fa3" textAlign="center" py={8} fontFamily="mono" fontSize="sm">
                        No videos available yet.
                      </Text>
                    )}
                  </List>
                </CardBody>
              </Card>

              {/* INSTRUCTOR */}
              <Card>
                <CardHeader>
                  <HStack spacing={4}>
                    <Avatar name="Coursell Team" size="md" bg="purple.500" />
                    <VStack align="start" spacing={0}>
                      <Heading fontFamily="display" fontWeight={400} fontSize="20px" letterSpacing="0.5px">
                        ABOUT THE INSTRUCTOR
                      </Heading>
                      <Text color="#7d8fa3" fontSize="sm">
                        Industry veteran with 10+ years of building real software.
                      </Text>
                    </VStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Text color="#7d8fa3" fontSize="sm" lineHeight="1.7">
                    Courses are taught by senior engineers who have shipped real products at scale.
                    Expect honest, practical lessons grounded in production experience.
                  </Text>
                </CardBody>
              </Card>

              {/* VIDEO PLAYER */}
              {hasAccess && selectedVideo && (
                <Card>
                  <CardBody>
                    <Heading fontFamily="display" fontSize="22px" fontWeight={400} mb={2} letterSpacing="0.5px">
                      {selectedVideo.title.toUpperCase()}
                    </Heading>
                    <Text color="#7d8fa3" fontSize="sm" mb={4}>
                      {selectedVideo.description}
                    </Text>
                    {videoLoading && (
                      <Box
                        w="100%"
                        h="360px"
                        bg="#0d1117"
                        border="1px solid"
                        borderColor="rgba(255,255,255,0.07)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={4}
                      >
                        <Spinner size="xl" color="brand.400" thickness="3px" />
                      </Box>
                    )}
                    {getYouTubeId(selectedVideo.videoUrl) ? (
                      <Box
                        as="iframe"
                        width="100%"
                        height="420"
                        src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.videoUrl)}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: videoLoading ? 'none' : 'block',
                        }}
                        onLoad={() => setVideoLoading(false)}
                      />
                    ) : selectedVideo.videoUrl.includes('vimeo.com') ? (
                      <Box
                        as="iframe"
                        width="100%"
                        height="420"
                        src={(() => {
                          if (selectedVideo.videoUrl.includes('player.vimeo.com')) {
                            return selectedVideo.videoUrl
                          }
                          const m = selectedVideo.videoUrl.match(/vimeo\.com\/(\d+)/)
                          return m ? `https://player.vimeo.com/video/${m[1]}` : selectedVideo.videoUrl
                        })()}
                        title="Vimeo video"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        style={{
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: videoLoading ? 'none' : 'block',
                        }}
                        onLoad={() => setVideoLoading(false)}
                      />
                    ) : (
                      <video
                        width="100%"
                        height="420"
                        controls
                        style={{
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: videoLoading ? 'none' : 'block',
                        }}
                        onLoadedData={() => setVideoLoading(false)}
                        onLoadStart={() => setVideoLoading(true)}
                      >
                        <source src={selectedVideo.videoUrl} type="video/mp4" />
                      </video>
                    )}
                  </CardBody>
                </Card>
              )}
            </VStack>

            {/* SIDEBAR */}
            <VStack align="stretch" spacing={6}>
              <Card position="sticky" top="100px">
                <CardBody>
                  <VStack spacing={5} align="stretch">
                    <VStack align="start" spacing={1}>
                      <Text fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                        Price
                      </Text>
                      <Heading fontFamily="display" fontSize="64px" fontWeight={400} color="brand.400" lineHeight={1}>
                        {isAdmin ? 'FREE' : `$${course.price}`}
                      </Heading>
                      <Text color="#7d8fa3" fontSize="sm">
                        {isAdmin ? 'Full admin access' : 'Lifetime access'}
                      </Text>
                    </VStack>

                    {hasAccess ? (
                      <Button
                        leftIcon={<FiCheck />}
                        bg="rgba(57,211,83,0.12)"
                        color="green.400"
                        border="1px solid"
                        borderColor="rgba(57,211,83,0.35)"
                        size="lg"
                        isDisabled
                        fontFamily="mono"
                        letterSpacing="2px"
                        textTransform="uppercase"
                        fontSize="13px"
                        _disabled={{ opacity: 1 }}
                      >
                        {isAdmin ? 'Admin Access' : 'Purchased'}
                      </Button>
                    ) : (
                      <Button
                        leftIcon={<FiDollarSign />}
                        variant="cyan"
                        size="lg"
                        onClick={openPurchase}
                        isLoading={purchasing}
                        loadingText="Processing..."
                        sx={{
                          clipPath:
                            'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                        }}
                      >
                        Buy Now
                      </Button>
                    )}

                    <Divider borderColor="rgba(255,255,255,0.07)" />

                    <VStack align="stretch" spacing={3}>
                      <HStack color="#7d8fa3" fontSize="sm">
                        <Icon as={FiVideo} color="brand.400" />
                        <Text>Lifetime access · {course.videos?.length || 0} videos</Text>
                      </HStack>
                      <HStack color="#7d8fa3" fontSize="sm">
                        <Icon as={FiAward} color="brand.400" />
                        <Text>Certificate of completion</Text>
                      </HStack>
                      <HStack color="#7d8fa3" fontSize="sm">
                        <Icon as={FiShield} color="brand.400" />
                        <Text>30-day money-back guarantee</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {relatedCourses.length > 0 && (
                <Card>
                  <CardHeader>
                    <Heading fontFamily="display" fontWeight={400} fontSize="20px" letterSpacing="0.5px">
                      RELATED COURSES
                    </Heading>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={3} align="stretch">
                      {relatedCourses.slice(0, 4).map((rc) => (
                        <Flex
                          key={rc._id}
                          as={RouterLink}
                          to={`/courses/${rc._id}`}
                          align="center"
                          gap={3}
                          p={3}
                          border="1px solid"
                          borderColor="rgba(255,255,255,0.07)"
                          _hover={{ borderColor: 'rgba(0,229,255,0.25)' }}
                          transition="border-color .2s"
                        >
                          <Image
                            src={rc.imageLink || '/fallback-course.png'}
                            boxSize="50px"
                            objectFit="cover"
                            alt={rc.title}
                          />
                          <VStack align="start" spacing={0}>
                            <Text color="white" fontSize="sm" noOfLines={1}>
                              {rc.title}
                            </Text>
                            <Text color="#7d8fa3" fontSize="xs" fontFamily="mono" textTransform="uppercase" letterSpacing="1px">
                              {rc.category || 'course'}
                            </Text>
                          </VStack>
                        </Flex>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </Grid>

          {/* PURCHASE MODAL */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg="rgba(8,11,15,0.7)" backdropFilter="blur(8px)" />
            <ModalContent>
              <ModalHeader fontFamily="display" letterSpacing="0.5px" textAlign="center">
                CONFIRM PURCHASE
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={5}>
                  <Box
                    p={4}
                    bg="rgba(0,229,255,0.06)"
                    border="1px solid"
                    borderColor="rgba(0,229,255,0.18)"
                    borderRadius="full"
                  >
                    <Icon as={FiDollarSign} w={10} h={10} color="brand.400" />
                  </Box>
                  <Text color="#7d8fa3" textAlign="center">
                    You are about to purchase:
                  </Text>
                  <Heading fontFamily="display" fontWeight={400} fontSize="28px" textAlign="center" letterSpacing="0.5px">
                    {course.title.toUpperCase()}
                  </Heading>
                  <Heading fontFamily="display" fontSize="48px" color="brand.400" fontWeight={400}>
                    ${course.price}
                  </Heading>
                  <Alert
                    status="info"
                    bg="rgba(0,229,255,0.06)"
                    color="brand.300"
                    border="1px solid"
                    borderColor="rgba(0,229,255,0.2)"
                  >
                    <AlertIcon color="brand.300" />
                    Pay the required amount to unlock the course.
                  </Alert>
                  <Button
                    variant="cyan"
                    size="lg"
                    w="full"
                    onClick={handlePurchase}
                    isLoading={purchasing}
                    loadingText="Processing..."
                    sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    Confirm Purchase
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  )
}

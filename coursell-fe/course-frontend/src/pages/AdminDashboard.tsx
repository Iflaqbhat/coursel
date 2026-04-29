import { useContext, useEffect, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiEye,
  FiLogOut,
  FiMoreVertical,
  FiPlay,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
  FiVideo,
} from 'react-icons/fi'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createCourse, getAdminCourses } from '../services/api'

interface Video {
  _id: string
  title: string
  description: string
  videoUrl: string
  duration: number
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
  videos?: Video[]
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalRevenue: 0,
    totalStudents: 0,
    publishedCourses: 0,
  })

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    imageLink: '',
    published: true,
    category: 'programming',
    level: 'beginner',
    videos: [],
  })

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    order: 1,
  })
  const [detectingDuration, setDetectingDuration] = useState(false)
  const [durationHint, setDurationHint] = useState('')
  const detectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const formatDur = (s: number) => {
    if (!s || s <= 0) return '—'
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.round(s % 60)
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m ${sec}s`
    return `${sec}s`
  }

  const isValidUrl = (u: string) => {
    try {
      new URL(u)
      return true
    } catch {
      return false
    }
  }

  const detectDuration = async (url: string) => {
    if (!isValidUrl(url)) {
      setDurationHint('')
      return
    }
    setDetectingDuration(true)
    setDurationHint('')
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/video/duration`,
        { params: { url } }
      )
      let duration: number = res.data?.duration || 0

      if (
        !duration &&
        res.data?.provider === 'direct' &&
        /\.(mp4|webm|ogg|m4v|mov)(\?|$)/i.test(url)
      ) {
        duration = await new Promise<number>((resolve) => {
          const v = document.createElement('video')
          v.preload = 'metadata'
          v.muted = true
          const cleanup = () => {
            v.removeAttribute('src')
            v.load()
          }
          v.onloadedmetadata = () => {
            const d = isFinite(v.duration) ? Math.round(v.duration) : 0
            cleanup()
            resolve(d)
          }
          v.onerror = () => {
            cleanup()
            resolve(0)
          }
          setTimeout(() => {
            cleanup()
            resolve(0)
          }, 8000)
          v.src = url
        })
      }

      setNewVideo((prev) => ({ ...prev, duration }))
      setDurationHint(
        duration > 0
          ? `Detected: ${formatDur(duration)}`
          : "Couldn't detect duration — saving without it."
      )
    } catch {
      setDurationHint("Couldn't detect duration — saving without it.")
    } finally {
      setDetectingDuration(false)
    }
  }

  useEffect(() => {
    if (detectTimeoutRef.current) clearTimeout(detectTimeoutRef.current)
    if (!newVideo.videoUrl.trim()) {
      setDurationHint('')
      return
    }
    detectTimeoutRef.current = setTimeout(() => {
      detectDuration(newVideo.videoUrl.trim())
    }, 600)
    return () => {
      if (detectTimeoutRef.current) clearTimeout(detectTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVideo.videoUrl])

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login')
      return
    }
    fetchCourses()
  }, [isAdmin, navigate])

  const fetchCourses = async () => {
    try {
      const response = await getAdminCourses()
      setCourses(response.data.courses)
      const totalRevenue = response.data.courses.reduce(
        (sum: number, c: Course) =>
          sum + c.price * (c.enrolledStudents?.length || 0),
        0
      )
      setStats({
        totalCourses: response.data.courses.length,
        totalRevenue,
        totalStudents: response.data.courses.reduce(
          (sum: number, c: Course) => sum + (c.enrolledStudents?.length || 0),
          0
        ),
        publishedCourses: response.data.courses.filter((c: Course) => c.published).length,
      })
    } catch (e) {
      toast({ title: 'Error fetching courses', status: 'error', duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async () => {
    try {
      await createCourse(newCourse)
      toast({ title: 'Course created', status: 'success', duration: 3000 })
      onClose()
      setNewCourse({
        title: '',
        description: '',
        price: 0,
        imageLink: '',
        published: true,
        category: 'programming',
        level: 'beginner',
        videos: [],
      })
      fetchCourses()
    } catch (e: any) {
      toast({
        title: 'Error creating course',
        description: e.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleAddVideo = async () => {
    if (!selectedCourse) return
    try {
      const currentVideos = selectedCourse.videos || []
      const nextOrder = currentVideos.length + 1
      const updatedVideos = [
        ...currentVideos,
        {
          title: newVideo.title,
          description: newVideo.description,
          videoUrl: newVideo.videoUrl,
          duration: newVideo.duration,
          order: nextOrder,
        },
      ]
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/course/${selectedCourse._id}/videos`,
        { videos: updatedVideos }
      )
      toast({ title: 'Video added', status: 'success', duration: 3000 })
      onVideoClose()
      setNewVideo({ title: '', description: '', videoUrl: '', duration: 0, order: 1 })
      setDurationHint('')
      fetchCourses()
    } catch (e: any) {
      toast({
        title: 'Error adding video',
        description: e.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/course/${id}`)
      toast({ title: 'Course deleted', status: 'success', duration: 3000 })
      fetchCourses()
    } catch (e: any) {
      toast({
        title: 'Error deleting course',
        description: e.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!selectedCourse) return
    if (!window.confirm('Delete this video?')) return
    try {
      const updatedVideos = (selectedCourse.videos || []).filter((v) => v._id !== videoId)
      updatedVideos.forEach((v, i) => (v.order = i + 1))
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/course/${selectedCourse._id}/videos`,
        { videos: updatedVideos }
      )
      toast({ title: 'Video deleted', status: 'success', duration: 3000 })
      setSelectedCourse({ ...selectedCourse, videos: updatedVideos })
      fetchCourses()
    } catch (e: any) {
      toast({
        title: 'Error deleting video',
        description: e.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const openVideoModal = (course: Course) => {
    setSelectedCourse(course)
    onVideoOpen()
  }

  if (!isAdmin) return null

  const statCards = [
    { label: 'Total Courses', value: stats.totalCourses, icon: FiBookOpen, color: 'brand.400' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: FiDollarSign, color: 'green.400' },
    { label: 'Total Students', value: stats.totalStudents, icon: FiUsers, color: 'purple.400' },
    { label: 'Published', value: stats.publishedCourses, icon: FiTrendingUp, color: 'pink.400' },
  ]

  return (
    <Box minH="100vh">
      <Container maxW="7xl" py={{ base: 8, md: 14 }} px={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center" mb={10} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={3}>
            <Box className="section-label">Admin Console</Box>
            <Heading className="section-title">
              ADMIN <Box as="span" color="pink.400">DASHBOARD</Box>
            </Heading>
          </VStack>
          <HStack>
            <IconButton
              aria-label="Settings"
              icon={<FiSettings />}
              variant="ghost"
              size="sm"
            />
            <Button leftIcon={<FiLogOut />} variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>

        {/* STATS */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={10}>
          {statCards.map((s, i) => (
            <Box
              key={i}
              position="relative"
              p={6}
              bg="#0d1117"
              border="1px solid"
              borderColor="rgba(255,255,255,0.07)"
              _hover={{ borderColor: 'rgba(0,229,255,0.2)' }}
              transition="all .3s"
              sx={{
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  bg: 'linear-gradient(90deg, #00e5ff, #7b61ff)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform .4s ease',
                },
                '&:hover::before': { transform: 'scaleX(1)' },
              }}
            >
              <Stat>
                <StatLabel color="#7d8fa3" fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase">
                  {s.label}
                </StatLabel>
                <StatNumber fontFamily="display" color={s.color} fontSize="42px" fontWeight={400}>
                  {s.value}
                </StatNumber>
                <Icon as={s.icon} color={s.color} />
              </Stat>
            </Box>
          ))}
        </SimpleGrid>

        <Flex
          justify="space-between"
          align={{ base: 'start', md: 'center' }}
          mb={5}
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <Heading
            fontFamily="display"
            fontWeight={400}
            color="white"
            fontSize="28px"
            letterSpacing="0.5px"
          >
            COURSE MANAGEMENT
          </Heading>
          <Button
            leftIcon={<FiPlus />}
            variant="cyan"
            onClick={onOpen}
            sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
          >
            New Course
          </Button>
        </Flex>

        <Card>
          <CardBody>
            {loading ? (
              <Text color="#7d8fa3" fontFamily="mono">Loading...</Text>
            ) : courses.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text color="#7d8fa3" mb={4} fontFamily="mono">
                  No courses yet
                </Text>
                <Button variant="cyan" onClick={onOpen}>
                  Create your first course
                </Button>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th fontFamily="mono">Course</Th>
                      <Th fontFamily="mono">Price</Th>
                      <Th fontFamily="mono">Status</Th>
                      <Th fontFamily="mono">Students</Th>
                      <Th fontFamily="mono">Videos</Th>
                      <Th fontFamily="mono">Created</Th>
                      <Th fontFamily="mono">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {courses.map((c) => (
                      <Tr key={c._id} _hover={{ bg: 'rgba(255,255,255,0.02)' }}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text color="white" fontWeight={500}>
                              {c.title}
                            </Text>
                            <Text color="#7d8fa3" fontSize="xs" noOfLines={1}>
                              {c.description}
                            </Text>
                          </VStack>
                        </Td>
                        <Td color="brand.400" fontFamily="mono">
                          ${c.price}
                        </Td>
                        <Td>
                          <Badge
                            bg={c.published ? 'rgba(57,211,83,0.12)' : 'rgba(255,255,255,0.05)'}
                            color={c.published ? 'green.400' : '#7d8fa3'}
                            border="1px solid"
                            borderColor={c.published ? 'rgba(57,211,83,0.3)' : 'rgba(255,255,255,0.12)'}
                          >
                            {c.published ? 'Live' : 'Draft'}
                          </Badge>
                        </Td>
                        <Td color="white">{c.enrolledStudents?.length || 0}</Td>
                        <Td color="white">{c.videos?.length || 0}</Td>
                        <Td color="#7d8fa3" fontSize="xs" fontFamily="mono">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<FiVideo />}
                              onClick={() => openVideoModal(c)}
                            >
                              Videos
                            </Button>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem icon={<FiEye />} onClick={() => navigate(`/courses/${c._id}`)}>
                                  View
                                </MenuItem>
                                <MenuItem icon={<FiEdit />} onClick={() => navigate(`/admin/edit-course/${c._id}`)}>
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  icon={<FiTrash2 />}
                                  color="pink.400"
                                  onClick={() => handleDeleteCourse(c._id)}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* CREATE COURSE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="rgba(8,11,15,0.7)" backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalHeader fontFamily="display" letterSpacing="0.5px">
            CREATE NEW COURSE
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                  Title
                </FormLabel>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Course title"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                  Description
                </FormLabel>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="What students will learn"
                  rows={3}
                />
              </FormControl>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                    Price ($)
                  </FormLabel>
                  <NumberInput
                    value={newCourse.price}
                    onChange={(v) => setNewCourse({ ...newCourse, price: Number(v) })}
                    min={0}
                  >
                    <NumberInputField placeholder="0.00" />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                    Image URL
                  </FormLabel>
                  <Input
                    value={newCourse.imageLink}
                    onChange={(e) => setNewCourse({ ...newCourse, imageLink: e.target.value })}
                    placeholder="https://..."
                  />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                    Category
                  </FormLabel>
                  <Select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  >
                    <option style={{ background: '#0d1117' }} value="programming">Programming</option>
                    <option style={{ background: '#0d1117' }} value="design">Design</option>
                    <option style={{ background: '#0d1117' }} value="business">Business</option>
                    <option style={{ background: '#0d1117' }} value="marketing">Marketing</option>
                    <option style={{ background: '#0d1117' }} value="music">Music</option>
                    <option style={{ background: '#0d1117' }} value="other">Other</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                    Level
                  </FormLabel>
                  <Select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                  >
                    <option style={{ background: '#0d1117' }} value="beginner">Beginner</option>
                    <option style={{ background: '#0d1117' }} value="intermediate">Intermediate</option>
                    <option style={{ background: '#0d1117' }} value="advanced">Advanced</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                  Published
                </FormLabel>
                <Switch
                  isChecked={newCourse.published}
                  onChange={(e) => setNewCourse({ ...newCourse, published: e.target.checked })}
                  colorScheme="blue"
                />
              </FormControl>
              <HStack spacing={3}>
                <Button onClick={onClose} variant="outline" flex={1}>
                  Cancel
                </Button>
                <Button
                  variant="cyan"
                  onClick={handleCreateCourse}
                  flex={1}
                  isDisabled={!newCourse.title || !newCourse.description}
                  sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  Create
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* MANAGE VIDEOS MODAL */}
      <Modal isOpen={isVideoOpen} onClose={onVideoClose} size="xl">
        <ModalOverlay bg="rgba(8,11,15,0.7)" backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalHeader fontFamily="display" letterSpacing="0.5px">
            VIDEOS — {selectedCourse?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={5} align="stretch">
              {selectedCourse?.videos && selectedCourse.videos.length > 0 && (
                <Box>
                  <Text fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="#7d8fa3" mb={3}>
                    Existing Videos ({selectedCourse.videos.length})
                  </Text>
                  <List spacing={2}>
                    {selectedCourse.videos
                      .sort((a, b) => a.order - b.order)
                      .map((v, i) => (
                        <ListItem key={v._id}>
                          <HStack
                            p={3}
                            bg="rgba(255,255,255,0.04)"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.08)"
                            borderRadius="md"
                          >
                            <ListIcon as={FiPlay} color="brand.400" />
                            <VStack align="start" spacing={1} flex={1}>
                              <Text color="white" fontSize="sm">
                                {i + 1}. {v.title}
                              </Text>
                              {typeof v.duration === 'number' && v.duration > 0 && (
                                <Text color="#7d8fa3" fontSize="xs" fontFamily="mono">
                                  {Math.floor(v.duration / 60)}m {v.duration % 60}s
                                </Text>
                              )}
                            </VStack>
                            <IconButton
                              size="sm"
                              icon={<FiTrash2 />}
                              variant="ghost"
                              color="pink.400"
                              aria-label="delete"
                              onClick={() => handleDeleteVideo(v._id)}
                            />
                          </HStack>
                        </ListItem>
                      ))}
                  </List>
                </Box>
              )}

              <Divider borderColor="rgba(255,255,255,0.07)" />

              <Box>
                <Text fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="#7d8fa3" mb={3}>
                  Add New Video
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Title
                    </FormLabel>
                    <Input
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Description
                    </FormLabel>
                    <Textarea
                      rows={2}
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontFamily="mono" fontSize="11px" color="#7d8fa3" letterSpacing="2px" textTransform="uppercase">
                      Video URL
                    </FormLabel>
                    <InputGroup>
                      <Input
                        value={newVideo.videoUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                        placeholder="YouTube / Vimeo / .mp4 link"
                        pr="3rem"
                      />
                      <InputRightElement h="full">
                        {detectingDuration ? (
                          <Spinner size="sm" color="brand.400" />
                        ) : newVideo.duration > 0 ? (
                          <Icon as={FiCheckCircle} color="green.400" />
                        ) : (
                          newVideo.videoUrl && (
                            <IconButton
                              aria-label="Re-detect"
                              icon={<FiRefreshCw />}
                              size="sm"
                              variant="ghost"
                              onClick={() => detectDuration(newVideo.videoUrl.trim())}
                            />
                          )
                        )}
                      </InputRightElement>
                    </InputGroup>
                    {durationHint && (
                      <HStack
                        mt={2}
                        spacing={2}
                        fontFamily="mono"
                        fontSize="11px"
                        color={newVideo.duration > 0 ? 'green.400' : '#7d8fa3'}
                        letterSpacing="1px"
                      >
                        <Icon as={FiClock} />
                        <Text>{durationHint}</Text>
                      </HStack>
                    )}
                  </FormControl>
                </VStack>
              </Box>

              <HStack spacing={3}>
                <Button onClick={onVideoClose} variant="outline" flex={1}>
                  Close
                </Button>
                <Button
                  variant="cyan"
                  onClick={handleAddVideo}
                  flex={1}
                  isDisabled={!newVideo.title || !newVideo.videoUrl}
                  sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  Add Video
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

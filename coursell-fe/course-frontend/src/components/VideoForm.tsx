import { useEffect, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
} from 'react-icons/fi'
import axios from 'axios'

interface Video {
  _id?: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
}

interface VideoFormProps {
  videos: Video[]
  onVideosChange: (videos: Video[]) => void
  isLoading?: boolean
}

const monoLabelStyle = {
  fontFamily: 'mono',
  fontSize: '11px',
  color: '#7d8fa3',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
}

const formatDuration = (s: number) => {
  if (!s || s <= 0) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.round(s % 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

const isValidUrl = (s: string) => {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

const VideoForm = ({ videos, onVideosChange, isLoading = false }: VideoFormProps) => {
  const toast = useToast()
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [detecting, setDetecting] = useState(false)
  const [detectedHint, setDetectedHint] = useState<string>('')
  const detectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const detectDuration = async (url: string) => {
    if (!isValidUrl(url)) {
      setDetectedHint('')
      return
    }
    setDetecting(true)
    setDetectedHint('')
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/video/duration`
      const res = await axios.get(apiUrl, { params: { url } })
      let duration: number = res.data?.duration || 0

      // Fallback: if backend returned 0 and URL looks like a direct file,
      // try HTML5 metadata in the browser.
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

      setFormData((prev) => ({ ...prev, duration }))
      if (duration > 0) {
        setDetectedHint(`Detected: ${formatDuration(duration)}`)
      } else {
        setDetectedHint(
          "Couldn't detect duration automatically — that's fine, it'll just be hidden."
        )
      }
    } catch (e) {
      setDetectedHint("Couldn't detect duration — saving without it.")
    } finally {
      setDetecting(false)
    }
  }

  // Re-detect with debounce whenever the URL changes
  useEffect(() => {
    if (detectTimeoutRef.current) clearTimeout(detectTimeoutRef.current)
    if (!formData.videoUrl.trim()) {
      setDetectedHint('')
      return
    }
    detectTimeoutRef.current = setTimeout(() => {
      detectDuration(formData.videoUrl.trim())
    }, 600)
    return () => {
      if (detectTimeoutRef.current) clearTimeout(detectTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.videoUrl])

  const validateForm = () => {
    const e: Record<string, string> = {}
    if (!formData.title.trim()) e.title = 'Title is required'
    else if (formData.title.length < 3) e.title = 'Too short'
    if (!formData.description.trim()) e.description = 'Description required'
    else if (formData.description.length < 10) e.description = 'Too short'
    if (!formData.videoUrl.trim()) e.videoUrl = 'URL required'
    else if (!isValidUrl(formData.videoUrl)) e.videoUrl = 'Invalid URL'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({ title: 'Validation Error', status: 'error', duration: 3000 })
      return
    }
    if (editingVideo) {
      const updated = videos.map((v) =>
        v._id === editingVideo._id ? { ...v, ...formData } : v
      )
      onVideosChange(updated)
      toast({ title: 'Video updated', status: 'success', duration: 2000 })
    } else {
      const newVideo: Video = {
        ...formData,
        order: videos.length + 1,
        _id: Date.now().toString(),
      }
      onVideosChange([...videos, newVideo])
      toast({ title: 'Video added', status: 'success', duration: 2000 })
    }
    setFormData({ title: '', description: '', videoUrl: '', duration: 0 })
    setDetectedHint('')
    setEditingVideo(null)
  }

  const handleEdit = (v: Video) => {
    setEditingVideo(v)
    setFormData({
      title: v.title,
      description: v.description,
      videoUrl: v.videoUrl,
      duration: v.duration,
    })
    setDetectedHint(v.duration > 0 ? `Detected: ${formatDuration(v.duration)}` : '')
  }

  const handleDelete = (id: string) => {
    const updated = videos.filter((v) => v._id !== id)
    updated.forEach((v, i) => (v.order = i + 1))
    onVideosChange(updated)
    toast({ title: 'Video deleted', status: 'success', duration: 2000 })
  }

  const handleCancel = () => {
    setEditingVideo(null)
    setFormData({ title: '', description: '', videoUrl: '', duration: 0 })
    setDetectedHint('')
    setErrors({})
  }

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading
          fontFamily="display"
          fontSize="22px"
          fontWeight={400}
          color="white"
          letterSpacing="0.5px"
          mb={1}
        >
          COURSE VIDEOS
        </Heading>
        <Text color="#7d8fa3" fontSize="sm" fontFamily="mono">
          Add a YouTube, Vimeo, or direct video link — duration is detected
          automatically.
        </Text>
      </Box>

      {videos.length > 0 && (
        <Box>
          <Text sx={monoLabelStyle} mb={3}>
            Current Videos ({videos.length})
          </Text>
          <VStack align="stretch" spacing={2}>
            {videos.map((v) => (
              <Box
                key={v._id}
                bg="rgba(255,255,255,0.03)"
                border="1px solid"
                borderColor="rgba(255,255,255,0.07)"
                p={4}
                transition="all .2s"
                _hover={{ borderColor: 'rgba(0,229,255,0.2)' }}
              >
                <Flex justify="space-between" align="center">
                  <Box flex={1}>
                    <HStack mb={1} spacing={3}>
                      <Badge variant="subtle" bg="rgba(0,229,255,0.08)" color="brand.300">
                        #{v.order}
                      </Badge>
                      <Text color="white" fontSize="sm" fontWeight={500}>
                        {v.title}
                      </Text>
                      {v.duration > 0 && (
                        <HStack spacing={1} color="#7d8fa3" fontSize="xs" fontFamily="mono">
                          <Icon as={FiClock} />
                          <Text>{formatDuration(v.duration)}</Text>
                        </HStack>
                      )}
                    </HStack>
                    <Text color="#7d8fa3" fontSize="xs" noOfLines={2}>
                      {v.description}
                    </Text>
                  </Box>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="edit"
                      icon={<FiEdit2 />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(v)}
                    />
                    <IconButton
                      aria-label="delete"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      color="pink.400"
                      onClick={() => handleDelete(v._id!)}
                    />
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      <Divider borderColor="rgba(255,255,255,0.07)" />

      <Box>
        <Text sx={monoLabelStyle} mb={3}>
          {editingVideo ? 'Edit Video' : 'Add New Video'}
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack align="stretch" spacing={4}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel sx={monoLabelStyle}>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Video title"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel sx={monoLabelStyle}>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="What this video covers"
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.videoUrl}>
              <FormLabel sx={monoLabelStyle}>Video URL</FormLabel>
              <InputGroup>
                <Input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="YouTube / Vimeo / .mp4 link"
                  pr="3rem"
                />
                <InputRightElement h="full">
                  {detecting ? (
                    <Spinner size="sm" color="brand.400" />
                  ) : formData.duration > 0 ? (
                    <Icon as={FiCheckCircle} color="green.400" />
                  ) : (
                    formData.videoUrl && (
                      <IconButton
                        aria-label="Re-detect duration"
                        icon={<FiRefreshCw />}
                        size="sm"
                        variant="ghost"
                        onClick={() => detectDuration(formData.videoUrl.trim())}
                      />
                    )
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.videoUrl}</FormErrorMessage>

              {detectedHint && (
                <HStack
                  mt={2}
                  spacing={2}
                  fontFamily="mono"
                  fontSize="11px"
                  color={formData.duration > 0 ? 'green.400' : '#7d8fa3'}
                  letterSpacing="1px"
                >
                  <Icon as={FiClock} />
                  <Text>{detectedHint}</Text>
                </HStack>
              )}
            </FormControl>

            <HStack spacing={3}>
              <Button
                type="submit"
                variant="cyan"
                leftIcon={editingVideo ? <FiEdit2 /> : <FiPlus />}
                isLoading={isLoading}
                flex={1}
                sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
              >
                {editingVideo ? 'Update Video' : 'Add Video'}
              </Button>
              {editingVideo && (
                <Button variant="outline" onClick={handleCancel} flex={1}>
                  Cancel
                </Button>
              )}
            </HStack>
          </VStack>
        </form>
      </Box>
    </VStack>
  )
}

export default VideoForm

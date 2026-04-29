import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react'
import VideoForm from './VideoForm'

interface Video {
  _id?: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
}

interface CourseFormProps {
  course?: {
    title: string
    description: string
    price: number
    imageLink: string
    published: boolean
    category?: string
    level?: string
    videos?: Video[]
  }
  onSubmit: (data: {
    title: string
    description: string
    price: number
    imageLink: string
    published: boolean
    category: string
    level: string
    videos: Video[]
  }) => void
  isLoading?: boolean
}

const CourseForm = ({ course, onSubmit, isLoading = false }: CourseFormProps) => {
  const toast = useToast()
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    imageLink: course?.imageLink || '',
    published: course?.published || false,
    category: course?.category || 'programming',
    level: course?.level || 'beginner',
  })
  const [videos, setVideos] = useState<Video[]>(course?.videos || [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'music', label: 'Music' },
    { value: 'other', label: 'Other' },
  ]
  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

  const isValidUrl = (s: string) => {
    try {
      new URL(s)
      return true
    } catch {
      return false
    }
  }

  const validateForm = () => {
    const e: Record<string, string> = {}
    if (!formData.title.trim()) e.title = 'Title is required'
    else if (formData.title.length < 3) e.title = 'Title must be at least 3 characters'
    if (!formData.description.trim()) e.description = 'Description is required'
    else if (formData.description.length < 10) e.description = 'Description too short'
    if (formData.price < 0) e.price = 'Price cannot be negative'
    if (!formData.imageLink.trim()) e.imageLink = 'Image link is required'
    else if (!isValidUrl(formData.imageLink)) e.imageLink = 'Invalid URL'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, published: e.target.checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors',
        status: 'error',
        duration: 3000,
      })
      return
    }
    onSubmit({ ...formData, price: Number(formData.price), videos })
  }

  const monoLabelStyle = {
    fontFamily: 'mono',
    fontSize: '11px',
    color: '#7d8fa3',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
  }

  return (
    <Card>
      <CardBody p={{ base: 5, md: 8 }}>
        <VStack align="stretch" spacing={5}>
          <Box>
            <Heading
              fontFamily="display"
              fontSize="28px"
              fontWeight={400}
              color="white"
              letterSpacing="0.5px"
              mb={1}
            >
              {course ? 'EDIT COURSE' : 'CREATE COURSE'}
            </Heading>
            <Text color="#7d8fa3" fontSize="sm" fontFamily="mono">
              Fill in the details to {course ? 'update' : 'launch'} your course.
            </Text>
          </Box>

          <Tabs variant="enclosed">
            <TabList borderColor="rgba(255,255,255,0.07)">
              <Tab fontFamily="mono" fontSize="12px" letterSpacing="2px" textTransform="uppercase">
                Basic Info
              </Tab>
              <Tab fontFamily="mono" fontSize="12px" letterSpacing="2px" textTransform="uppercase">
                Videos
                {videos.length > 0 && (
                  <Badge ml={2} variant="subtle" bg="rgba(0,229,255,0.08)" color="brand.300">
                    {videos.length}
                  </Badge>
                )}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <form onSubmit={handleSubmit}>
                  <VStack align="stretch" spacing={5}>
                    <FormControl isInvalid={!!errors.title}>
                      <FormLabel sx={monoLabelStyle}>Course Title</FormLabel>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Mastering React with TypeScript"
                        size="lg"
                      />
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.description}>
                      <FormLabel sx={monoLabelStyle}>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What students will learn"
                        rows={4}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>

                    <Divider borderColor="rgba(255,255,255,0.07)" />

                    <HStack spacing={4} align="start" flexDirection={{ base: 'column', md: 'row' }}>
                      <FormControl isInvalid={!!errors.price}>
                        <FormLabel sx={monoLabelStyle}>Price ($)</FormLabel>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          size="lg"
                        />
                        <FormErrorMessage>{errors.price}</FormErrorMessage>
                      </FormControl>
                      <FormControl>
                        <FormLabel sx={monoLabelStyle}>Category</FormLabel>
                        <Select name="category" value={formData.category} onChange={handleChange} size="lg">
                          {categories.map((c) => (
                            <option key={c.value} value={c.value} style={{ background: '#0d1117' }}>
                              {c.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </HStack>

                    <HStack spacing={4} align="start" flexDirection={{ base: 'column', md: 'row' }}>
                      <FormControl>
                        <FormLabel sx={monoLabelStyle}>Difficulty</FormLabel>
                        <Select name="level" value={formData.level} onChange={handleChange} size="lg">
                          {levels.map((l) => (
                            <option key={l.value} value={l.value} style={{ background: '#0d1117' }}>
                              {l.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel sx={monoLabelStyle}>Status</FormLabel>
                        <Flex
                          align="center"
                          h="48px"
                          px={4}
                          bg="rgba(255,255,255,0.04)"
                          border="1px solid"
                          borderColor="rgba(255,255,255,0.12)"
                          borderRadius="md"
                          gap={3}
                        >
                          <Switch
                            name="published"
                            isChecked={formData.published}
                            onChange={handleSwitchChange}
                            colorScheme="blue"
                          />
                          <Text color="#7d8fa3" fontSize="sm" fontFamily="mono">
                            {formData.published ? 'Published' : 'Draft'}
                          </Text>
                        </Flex>
                      </FormControl>
                    </HStack>

                    <Divider borderColor="rgba(255,255,255,0.07)" />

                    <FormControl isInvalid={!!errors.imageLink}>
                      <FormLabel sx={monoLabelStyle}>Course Image URL</FormLabel>
                      <Input
                        name="imageLink"
                        value={formData.imageLink}
                        onChange={handleChange}
                        placeholder="https://..."
                        size="lg"
                      />
                      <FormErrorMessage>{errors.imageLink}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      variant="cyan"
                      size="lg"
                      isLoading={isLoading}
                      loadingText={course ? 'Updating...' : 'Creating...'}
                      sx={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                    >
                      {course ? 'Update Course' : 'Create Course'}
                    </Button>
                  </VStack>
                </form>
              </TabPanel>

              <TabPanel px={0}>
                <VideoForm videos={videos} onVideosChange={setVideos} isLoading={isLoading} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default CourseForm

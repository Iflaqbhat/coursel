import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
  Card,
  CardBody,
  Heading,
  Divider,
  IconButton,
  Icon,
  Flex,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlay, FiTrash2, FiEdit2, FiPlus, FiClock } from 'react-icons/fi';

interface Video {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface VideoFormProps {
  videos: Video[];
  onVideosChange: (videos: Video[]) => void;
  isLoading?: boolean;
}

const VideoForm = ({ videos, onVideosChange, isLoading = false }: VideoFormProps) => {
  const toast = useToast();
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else if (!isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDurationChange = (value: string) => {
    const duration = parseInt(value) || 0;
    setFormData({ ...formData, duration });
    
    if (errors.duration) {
      setErrors({ ...errors, duration: '' });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (editingVideo) {
      // Update existing video
      const updatedVideos = videos.map(video => 
        video._id === editingVideo._id 
          ? { ...video, ...formData }
          : video
      );
      onVideosChange(updatedVideos);
      toast({
        title: 'Success!',
        description: 'Video updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      // Add new video
      const newVideo: Video = {
        ...formData,
        order: videos.length + 1,
        _id: Date.now().toString(), // Temporary ID for frontend
      };
      onVideosChange([...videos, newVideo]);
      toast({
        title: 'Success!',
        description: 'Video added successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }

    // Reset form
    setFormData({ title: '', description: '', videoUrl: '', duration: 0 });
    setEditingVideo(null);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      duration: video.duration,
    });
  };

  const handleDelete = (videoId: string) => {
    const updatedVideos = videos.filter(video => video._id !== videoId);
    // Reorder remaining videos
    updatedVideos.forEach((video, index) => {
      video.order = index + 1;
    });
    onVideosChange(updatedVideos);
    toast({
      title: 'Success!',
      description: 'Video deleted successfully',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCancel = () => {
    setEditingVideo(null);
    setFormData({ title: '', description: '', videoUrl: '', duration: 0 });
    setErrors({});
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="md" mb={2}>
              Course Videos
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Manage the videos for your course. Add, edit, or remove video content.
            </Text>
          </Box>

          {/* Video List */}
          {videos.length > 0 && (
            <Box>
              <Text fontWeight="semibold" mb={3} color="purple.600">
                Current Videos ({videos.length})
              </Text>
              <VStack spacing={3} align="stretch">
                {videos.map((video, index) => (
                  <Card key={video._id} variant="outline" size="sm">
                    <CardBody p={4}>
                      <Flex justify="space-between" align="center">
                        <Box flex="1">
                          <HStack spacing={3} mb={2}>
                            <Badge colorScheme="purple" variant="subtle">
                              #{video.order}
                            </Badge>
                            <Text fontWeight="semibold" fontSize="sm">
                              {video.title}
                            </Text>
                            <HStack spacing={1} color="gray.500">
                              <Icon as={FiClock} w={3} h={3} />
                              <Text fontSize="xs">{formatDuration(video.duration)}</Text>
                            </HStack>
                          </HStack>
                          <Text fontSize="xs" color="gray.600" noOfLines={2}>
                            {video.description}
                          </Text>
                        </Box>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Edit video"
                            icon={<FiEdit2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="purple"
                            onClick={() => handleEdit(video)}
                          />
                          <IconButton
                            aria-label="Delete video"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDelete(video._id!)}
                          />
                        </HStack>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          )}

          <Divider />

          {/* Add/Edit Video Form */}
          <Box>
            <Text fontWeight="semibold" mb={3} color="purple.600">
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>Video Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter video title"
                    size="md"
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this video covers"
                    size="md"
                    rows={3}
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl isInvalid={!!errors.videoUrl}>
                    <FormLabel>Video URL</FormLabel>
                    <Input
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/video.mp4"
                      size="md"
                    />
                    <FormErrorMessage>{errors.videoUrl}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.duration}>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <NumberInput
                      value={formData.duration}
                      onChange={handleDurationChange}
                      min={1}
                      size="md"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.duration}</FormErrorMessage>
                  </FormControl>
                </HStack>

                <HStack spacing={3} w="full">
                  <Button
                    type="submit"
                    colorScheme="purple"
                    leftIcon={editingVideo ? <FiEdit2 /> : <FiPlus />}
                    isLoading={isLoading}
                    loadingText={editingVideo ? 'Updating...' : 'Adding...'}
                    flex="1"
                  >
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </Button>
                  {editingVideo && (
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      flex="1"
                    >
                      Cancel
                    </Button>
                  )}
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default VideoForm; 
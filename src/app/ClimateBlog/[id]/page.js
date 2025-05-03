'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Avatar,
  Divider,
  Chip,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

// Nature-inspired theme - keeping the same UI theme from ShareYourMoment
const natureTheme = createTheme({
  palette: {
    primary: {
      main: '#1A4D2E', // Forest green
      dark: '#2E7D32',
      light: '#81C784',
      contrastText: '#F8DCDA',
    },
    secondary: {
      main: '#64B5F6', // Sky blue
      dark: '#1976D2',
      light: '#90CAF9',
    },
    background: {
      default: '#F8DCDA', // Soft cream background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E3E3E',
      secondary: '#727272',
    },
    error: {
      main: '#EF5350',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#64B5F6',
    },
    success: {
      main: '#81C784',
    },
  },
  typography: {
    fontFamily: "'Quicksand', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 600,
          padding: '10px 24px',
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// API base URL - consistent with ShareYourMoment
const API_BASE_URL = 'https://ghibliclimatechange-awareness.onrender.com';

// Format date helper function - matching the format in ShareYourMoment
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Format paragraph texts to preserve new lines
const formatParagraphs = (text) => {
  if (!text) return '';
  return text.split('\n').map((paragraph, index) => (
    <Typography 
      key={index} 
      variant="body1" 
      component="p" 
      sx={{ 
        mb: 2,
        lineHeight: 1.7,
        color: 'text.primary',
      }}
    >
      {paragraph}
    </Typography>
  ));
};

// Categories - SYNCHRONIZED with ShareYourMoment component
const CATEGORIES = [
  'Community action', 
  'Education', 
  'Climate Policy'
];

export default function ClimateBlogPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Edit mode states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    text: '',
    category: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  // Get auth token from localStorage - same as in ShareYourMoment
  const getAuthToken = () => localStorage.getItem('token');
  
  // Get current user ID from token
  const getCurrentUserId = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      // Parse JWT token to get user ID
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload).userId;
    } catch (err) {
      return null;
    }
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        setError(null);
        
        // Add authorization header if user is logged in
        const headers = {};
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/get-story/${postId}`, { 
          headers 
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          } else if (response.status === 401) {
            throw new Error('You need to log in to view this post');
          } else {
            throw new Error('Failed to load post');
          }
        }

        const data = await response.json();
        // Set post data - SYNCHRONIZED with ShareYourMoment component
        setPost(data.post || data); // Handle both response formats
        
        // Check if the current user is the author
        const currentUserId = getCurrentUserId();
        if (currentUserId && data.post && data.post.author && data.post.author.userId === currentUserId) {
          setIsAuthor(true);
        } else if (currentUserId && data.author && data.author.userId === currentUserId) {
          setIsAuthor(true);
        }
        
        // Initialize edit form with post data
        setEditFormData({
          title: (data.post ? data.post.title : data.title) || '',
          text: (data.post ? data.post.text : data.text) || '',
          category: (data.post ? data.post.category : data.category) || ''
        });
      } catch (err) {
        setError(err.message);
        setAlert({
          open: true,
          message: err.message,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    getCurrentUserId();
  }, [postId, getCurrentUserId]);

  // Handle going back to main page
  const handleBack = () => {
    router.push('/ClimateBlog'); // Navigate to the ShareYourMoment page
  };

  // Handle share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Climate Action Story',
        text: `Check out this climate action story: ${post?.title}`,
        url: window.location.href,
      })
      .then(() => {
        setAlert({
          open: true,
          message: 'Story shared successfully!',
          severity: 'success'
        });
      })
      .catch(() => {
        // Fall back to copying link if share fails
        copyToClipboard();
      });
    } else {
      // If Web Share API not available
      copyToClipboard();
    }
  };

  // Copy URL to clipboard helper
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setAlert({
          open: true,
          message: 'Link copied to clipboard!',
          severity: 'success'
        });
      })
      .catch(() => {
        setAlert({
          open: true,
          message: 'Failed to copy link',
          severity: 'error'
        });
      });
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false
    });
  };

  // Open edit dialog
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    // Reset form data to original post data
    if (post) {
      setEditFormData({
        title: post.title || '',
        text: post.text || '',
        category: post.category || ''
      });
    }
  };

  // Handle edit form input changes
  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Submit the edit form - endpoint synchronized with ShareYourMoment
  const handleSubmitEdit = async () => {
    // Validate form data
    if (!editFormData.title || !editFormData.text || !editFormData.category) {
      setAlert({
        open: true,
        message: 'Please fill out all fields',
        severity: 'error'
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setAlert({
        open: true,
        message: 'Please log in to edit this post',
        severity: 'error'
      });
      return;
    }

    try {
      setEditLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/update-story/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post');
      }

      const data = await response.json();
      setPost(data.post || data);
      setIsEditDialogOpen(false);
      
      setAlert({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      setAlert({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <ThemeProvider theme={natureTheme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back to Stories
          </Button>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: '#FCFFE0',
                border: '1px solid #E0E0E0',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1">
                {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleBack}
                sx={{ mt: 3 }}
              >
                Return to Stories
              </Button>
            </Paper>
          ) : post ? (
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                backgroundColor: '#FCFFE0',
                border: '1px solid #DDDDDD',  // Added light thin border
                boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
              }}
            >
              {/* Edit button (only visible to author) */}
              {isAuthor && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenEditDialog}
                    size="small"
                  >
                    Edit Story
                  </Button>
                </Box>
              )}
              
              {/* Category and date */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <Chip
                  label={post.category}
                  size="small"
                  color="primary"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>

              {/* Post title */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  mb: 3,
                  color: 'primary.dark',
                  fontWeight: 'bold',
                  lineHeight: 1.2
                }}
              >
                {post.title}
              </Typography>

              {/* Author info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.light',
                    mr: 1.5,
                  }}
                >
                  {post.author && post.author.username ? post.author.username.charAt(0).toUpperCase() : '?'}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {post.author && post.author.username ? post.author.username : 'Anonymous'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Climate Action Contributor
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Post content */}
              <Box sx={{ mb: 4 }}>
                {formatParagraphs(post.text)}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Share button only */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
              }}>
                <Button
                  startIcon={<ShareIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={handleShare}
                  size="small"
                >
                  Share
                </Button>
              </Box>

              {/* Related stories section */}
              <Box sx={{ mt: 6 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    color: 'primary.main',
                    fontWeight: 'bold' 
                  }}
                >
                  More Climate Action Stories
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Check back soon for more stories related to "{post.category}"
                </Typography>
              </Box>
            </Paper>
          ) : null}

          <Box
            component="footer"
            sx={{
              textAlign: 'center',
              mt: 4,
              color: 'text.secondary',
              fontSize: 14
            }}
          >
            Together we can make a difference for our planet
          </Box>
        </Container>
      </Box>

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Edit Your Climate Action Story
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={editFormData.title}
              onChange={handleEditFormChange}
              margin="normal"
              variant="outlined"
              required
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                name="category"
                value={editFormData.category}
                onChange={handleEditFormChange}
                label="Category"
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Story"
              name="text"
              value={editFormData.text}
              onChange={handleEditFormChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={12}
              required
              placeholder="Share your climate action story..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            variant="contained" 
            color="primary"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert/Snackbar for notifications */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
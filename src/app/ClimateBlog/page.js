'use client';
import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Grid,
  Avatar,
  Divider,
  Chip,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import { useRouter } from 'next/navigation';

// Nature-inspired theme - keeping the same UI theme
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

// Updated categories to match the specified values
const categories = [
  'Community action', 
  'Education', 
  'Climate Policy'
];

// API base URL - adjust this to match your backend URL
const API_BASE_URL = 'https://ghibliclimatechange-awareness.onrender.com';

// Helper function to get first two lines (approximately 180 characters)
const getTwoLines = (text) => {
  if (text.length <= 180) return text;
  return text.substring(0, 180) + "...";
};

// Format date helper function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function ShareYourMoment() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    text: '',
    category: 'Community action',
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Get auth token from localStorage - consistent with ClimateActionGoals
  const getAuthToken = () => localStorage.getItem('token');

  // Check if user is logged in
  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/get-story?page=${pagination.page}&limit=${pagination.limit}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      // Add authorization header if user is logged in
      const headers = {};
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        // Handle unauthorized specifically
        if (response.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem('token'); // Clear invalid token
          throw new Error('Please log in to view posts');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setPagination({
        ...pagination,
        total: data.total,
        pages: data.pages
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to load posts: ' + error.message,
        severity: 'error'
      });
      setPosts([]); // Clear posts on error
    } finally {
      setLoading(false);
    }
  };

  // Load posts on initial render and when pagination changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle dialog open/close
  const handleOpenDialog = () => {
    if (!isLoggedIn) {
      setAlert({
        open: true,
        message: 'Please log in to share your story',
        severity: 'warning'
      });
      return;
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => setOpenDialog(false);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle post submission
  const handleSubmitPost = async () => {
    // Validate form
    if (!newPost.title || !newPost.text || !newPost.category) {
      setAlert({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      const token = getAuthToken();
      
      if (!token) {
        setAlert({
          open: true,
          message: 'You must be logged in to share a story',
          severity: 'error'
        });
        return;
      }
      
      // Submit to API using fetch
      const response = await fetch(`${API_BASE_URL}/post-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPost.title,
          text: newPost.text,
          category: newPost.category
        })
      });
      
      if (!response.ok) {
        // Handle unauthorized specifically
        if (response.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem('token'); // Clear invalid token
          throw new Error('Your login session has expired. Please log in again.');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit post');
      }
      
      // Show success alert
      setAlert({
        open: true,
        message: 'Your story has been shared successfully!',
        severity: 'success'
      });
      
      // Reset form and close dialog
      setNewPost({
        title: '',
        text: '',
        category: 'Community action',
      });
      handleCloseDialog();
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to share your story: ' + error.message,
        severity: 'error'
      });
    }
  };

  // Handle category change for filtering
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPagination({
      ...pagination,
      page: value
    });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: 1 // Reset to first page when searching
    });
    fetchPosts();
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert({
      ...alert,
      open: false
    });
  };

  // NEW: Handle post click to navigate to individual post page
  const handlePostClick = (postId) => {
    router.push(`http://localhost:3000/ClimateBlog/${postId}`);
  };

  // Check for token changes (e.g., if user logs in/out in another tab)
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = getAuthToken();
      setIsLoggedIn(!!token);
    };

    // Check login status when window gains focus
    window.addEventListener('focus', checkLoginStatus);
    
    return () => {
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, []);

  // Filter posts by category if not using backend filtering
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

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
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              backgroundColor: '#FCFFE0',
              border: '1px solid #E0E0E0',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                mb: 1, 
                color: 'primary.main',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Share Your Moment
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 3, 
                color: 'text.secondary',
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              Stories of climate action and environmental stewardship
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleOpenDialog}
                sx={{ 
                  borderRadius: 8,
                  px: 4,
                  py: 1.5,
                }}
              >
                Share Your Story
              </Button>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            {/* Search box */}
            <Box sx={{ mb: 3 }}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <Button type="submit" variant="contained" size="small">Search</Button>
                    )
                  }}
                />
              </form>
            </Box>
            
            {/* Categories filter */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ mb: 4, justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}
            >
              <Chip
                label="All"
                color="primary"
                variant={activeCategory === 'All' ? "filled" : "outlined"}
                onClick={() => handleCategoryChange('All')}
                sx={{ borderRadius: 4 }}
              />
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant={activeCategory === category ? "filled" : "outlined"}
                  color="primary"
                  onClick={() => handleCategoryChange(category)}
                  sx={{ borderRadius: 4 }}
                />
              ))}
            </Stack>
            
            {/* Blog posts list */}
            <Stack spacing={3}>
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Loading stories...
                  </Typography>
                </Box>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Paper
                    key={post._id}
                    variant="outlined"
                    onClick={() => handlePostClick(post._id)}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      borderColor: '#E0E0E0',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Chip 
                              label={post.category} 
                              size="small" 
                              color="primary" 
                              sx={{ 
                                height: 22, 
                                fontSize: '0.7rem',
                                fontWeight: 600 
                              }} 
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(post.createdAt)}
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="h6" 
                            component="h2" 
                            sx={{ 
                              mb: 1,
                              color: 'primary.dark',
                              lineHeight: 1.2
                            }}
                          >
                            {post.title}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2,
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                            }}
                          >
                            {getTwoLines(post.text)}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 28, 
                                height: 28, 
                                bgcolor: 'primary.light',
                                mr: 1,
                                fontSize: '0.875rem'
                              }}
                            >
                              {post.author && post.author.username ? post.author.username.charAt(0).toUpperCase() : '?'}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {post.author && post.author.username ? post.author.username : 'Anonymous'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No stories found in this category yet. Be the first to share!
                  </Typography>
                </Box>
              )}
            </Stack>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={pagination.pages} 
                  page={pagination.page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </Paper>
          
          <Box 
            component="footer"
            sx={{ 
              textAlign: 'center', 
              mt: 2, 
              color: 'text.secondary',
              fontSize: 14
            }}
          >
            Together we can make a difference for our planet
          </Box>
        </Container>
      </Box>

      {/* Dialog for creating new posts */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Share Your Climate Action Story
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Tell others about what you&apos;ve done to help the environment or raise awareness about climate change.
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                required
                value={newPost.title}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={newPost.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="text"
                label="Your Post"
                fullWidth
                required
                multiline
                rows={6}
                value={newPost.text}
                onChange={handleInputChange}
                margin="dense"
                helperText="Share what you did, why it matters, and how others might get involved"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitPost} 
            variant="contained"
            disabled={!newPost.title || !newPost.text || !newPost.category}
          >
            Share My Story
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
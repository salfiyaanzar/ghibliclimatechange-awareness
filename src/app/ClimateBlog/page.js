'use client';
import React, { useState } from 'react';
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
  InputLabel
} from '@mui/material';

// Nature-inspired theme
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

// Sample blog data - climate action posts
const initialBlogPosts = [
    {
        id: 1,
        title: "Community Beach Cleanup - 50 Volunteers Strong!",
        author: "Maya Chen",
        excerpt: "Last weekend, I organized a beach cleanup that brought together 50 local residents. Together we collected over 200 pounds of plastic waste and recyclables. It was inspiring to see people of all ages working together for our oceans.",
        category: "Community Action",
        date: "April 18, 2025"
    },
    {
        id: 2,
        title: "My Zero-Waste Kitchen Journey",
        author: "James Wilson",
        excerpt: "Six months ago, I challenged myself to transition to a zero-waste kitchen. From composting to bulk shopping with reusable containers, I've reduced my household waste by 80%. Here are the practical steps that made the biggest difference.",
        category: "Sustainable Living",
        date: "April 15, 2025"
    },
    {
        id: 3,
        title: "School Garden Project: Teaching Kids About Food Systems",
        author: "Priya Sharma", 
        excerpt: "As a middle school teacher, I started a school garden project to connect students with where their food comes from. This year, we've grown over 15 different vegetables and donated surplus harvest to our local food bank.",
        category: "Education",
        date: "April 10, 2025"
    },
    {
        id: 4,
        title: "Solar Panel Installation: First Year Results",
        author: "Marcus Johnson",
        excerpt: "One year after installing solar panels on our roof, I'm sharing the real impact it's had on our energy bills and carbon footprint. The investment is paying off faster than expected and the process was easier than I thought.",
        category: "Renewable Energy",
        date: "April 5, 2025"
    },
    {
        id: 5,
        title: "Urban Tree Planting Initiative",
        author: "Sofia Rodriguez",
        excerpt: "Our neighborhood association partnered with the city to plant 100 new trees along our streets. I coordinated volunteer teams and tracked our progress. The difference in air quality and street temperature is already noticeable.",
        category: "Urban Greening",
        date: "April 1, 2025"
    }
];

// Helper function to get first two lines (approximately 180 characters)
const getTwoLines = (text) => {
  if (text.length <= 180) return text;
  return text.substring(0, 180) + "...";
};

// Available categories
const categories = [
  'Community Action', 
  'Sustainable Living', 
  'Education', 
  'Renewable Energy', 
  'Urban Greening',
  'Conservation',
  'Climate Policy',
  'Wildlife Protection'
];

export default function ShareYourMoment() {
  const [posts, setPosts] = useState(initialBlogPosts);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    author: '',
    excerpt: '',
    category: 'Community Action',
  });
  const [activeCategory, setActiveCategory] = useState('All');

  // Handle dialog open/close
  const handleOpenDialog = () => setOpenDialog(true);
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
  const handleSubmitPost = () => {
    // Validate form
    if (!newPost.title || !newPost.author || !newPost.excerpt) {
      return; // Don't submit if required fields are empty
    }

    // Create new post
    const post = {
      id: posts.length + 1,
      ...newPost,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    // Add to posts
    setPosts([post, ...posts]);
    
    // Reset form and close dialog
    setNewPost({
      title: '',
      author: '',
      excerpt: '',
      category: 'Community Action',
    });
    handleCloseDialog();
  };

  // Filter posts by category
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
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
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Paper
                    key={post.id}
                    variant="outlined"
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
                              {post.date}
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
                            {getTwoLines(post.excerpt)}
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
                              {post.author.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {post.author}
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
            Tell others about what you've done to help the environment or raise awareness about climate change.
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="author"
                label="Your Name"
                fullWidth
                required
                value={newPost.author}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                name="excerpt"
                label="Your Post"
                fullWidth
                required
                multiline
                rows={6}
                value={newPost.excerpt}
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
            disabled={!newPost.title || !newPost.author || !newPost.excerpt}
          >
            Share My Story
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}